import uuid
from html import escape
from decimal import Decimal
from django.db import transaction
from django.db.models import Q, F
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsStudent
from students.models import StudentProfile
from courses.models import (
    LearningResource,
    LearningRecommendation,
    CourseEnrollment,
    CoursePayment,
    EnrollmentStatus,
    PaymentStatus,
    RecommendationStatus,
)
from courses.serializers import (
    LearningResourceSerializer,
    CourseEnrollmentSerializer,
    CoursePaymentSerializer,
    LearningRecommendationSerializer,
)
from skills.models import StudentSkill, SkillScoreHistory, SkillSource
from courses.services.recommendation_engine import generate_learning_recommendations


class LearningResourceListView(generics.ListCreateAPIView):
    """
    GET  /api/courses/resources/ -> List active courses / learning resources (filterable by ?limit=, ?skill=, ?type=, ?level=, ?search=)
    POST /api/courses/resources/ -> Create new course / learning resource (for Institutes & Admins)
    """
    serializer_class = LearningResourceSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = LearningResource.objects.filter(is_active=True).select_related('institution', 'skill')
        skill_param = self.request.query_params.get('skill')
        resource_type = self.request.query_params.get('type')
        level = self.request.query_params.get('level')
        search = self.request.query_params.get('search')
        limit = self.request.query_params.get('limit')

        if skill_param:
            queryset = queryset.filter(Q(skill__name__icontains=skill_param) | Q(skill__id__iexact=skill_param))
        if resource_type:
            queryset = queryset.filter(resource_type__iexact=resource_type)
        if level:
            queryset = queryset.filter(level__iexact=level)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(instructor_name__icontains=search) |
                Q(institution__name__icontains=search)
            )

        if limit:
            try:
                limit_int = int(limit)
                return queryset[:limit_int]
            except ValueError:
                pass

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        inst = None
        instructor = user.full_name or f"{user.first_name} {user.last_name}".strip() or "Course Instructor"
        if getattr(user, 'role', None) == 'academician' and hasattr(user, 'academician_profile'):
            inst = user.academician_profile.institution
            if inst and not user.full_name:
                instructor = inst.name

        serializer.save(
            institution=inst,
            instructor_name=instructor if not serializer.validated_data.get('instructor_name') else serializer.validated_data.get('instructor_name')
        )


class LearningResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/courses/resources/{id}/ -> Get course details
    PATCH  /api/courses/resources/{id}/ -> Update course (Institute/Admin)
    DELETE /api/courses/resources/{id}/ -> Delete course (Institute/Admin)
    """
    serializer_class = LearningResourceSerializer
    queryset = LearningResource.objects.all().select_related('institution', 'skill')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class MyInstituteCoursesView(generics.ListAPIView):
    """
    GET /api/courses/resources/my/ -> List courses created by the authenticated institute
    """
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'academician' and hasattr(user, 'academician_profile'):
            inst = user.academician_profile.institution
            if inst:
                return LearningResource.objects.filter(institution=inst).select_related('institution', 'skill')
        return LearningResource.objects.none()


class CourseEnrollView(APIView):
    """
    POST /api/courses/resources/{id}/enroll/
    Enrolls the authenticated student into the course (Handles Free & Paid with Payment Record).
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        user = request.user
        if not hasattr(user, 'student_profile'):
            return Response(
                {"error": "Only student accounts can enroll in courses. Please login with a student account."},
                status=status.HTTP_403_FORBIDDEN
            )

        student = user.student_profile
        try:
            resource = LearningResource.objects.get(id=pk, is_active=True)
        except LearningResource.DoesNotExist:
            return Response({"error": "Course not found or inactive."}, status=status.HTTP_404_NOT_FOUND)

        # Check existing enrollment
        existing = CourseEnrollment.objects.filter(student=student, resource=resource).first()
        if existing:
            serializer = CourseEnrollmentSerializer(existing)
            return Response({
                "message": "Already enrolled in this course.",
                "enrollment": serializer.data,
                "already_enrolled": True
            }, status=status.HTTP_200_OK)

        # Check pricing & payment
        payment_method = request.data.get('payment_method', 'FREE_ENROLLMENT')
        tx_id = request.data.get('transaction_id', f"TXN-{uuid.uuid4().hex[:12].upper()}")
        amount_paid = Decimal(str(request.data.get('amount', resource.price if not resource.is_free else 0.00)))

        # Create enrollment
        enrollment = CourseEnrollment.objects.create(
            student=student,
            resource=resource,
            status=EnrollmentStatus.ACTIVE,
            progress_percent=0,
            completed_lessons=[],
        )

        # Record payment if paid
        if not resource.is_free and amount_paid > 0:
            CoursePayment.objects.create(
                enrollment=enrollment,
                student=student,
                resource=resource,
                amount=amount_paid,
                payment_method=payment_method,
                transaction_id=tx_id,
                status=PaymentStatus.SUCCESS,
            )

        # Increment enrolled count
        LearningResource.objects.filter(id=resource.id).update(enrolled_count=F('enrolled_count') + 1)
        resource.refresh_from_db()

        serializer = CourseEnrollmentSerializer(enrollment)
        return Response({
            "message": "Successfully enrolled in course!",
            "enrollment": serializer.data,
            "already_enrolled": False
        }, status=status.HTTP_201_CREATED)


class MyEnrollmentsView(generics.ListAPIView):
    """
    GET /api/courses/my-enrollments/
    Returns list of courses the authenticated student is currently enrolled in.
    """
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return CourseEnrollment.objects.filter(student=user.student_profile).select_related(
                'resource',
                'resource__skill',
                'resource__institution'
            ).order_by('-enrolled_at')
        return CourseEnrollment.objects.none()


class EnrollmentDetailView(generics.RetrieveAPIView):
    """
    GET /api/courses/enrollments/{id}/
    Returns detailed enrollment information for learning player.
    """
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return CourseEnrollment.objects.filter(student=user.student_profile).select_related(
                'resource',
                'resource__skill',
                'resource__institution'
            )
        return CourseEnrollment.objects.none()


class UpdateCourseProgressView(APIView):
    """
    POST /api/courses/enrollments/{id}/progress/
    Payload: { "lesson_id": "l-1-2", "completed": true, "last_played": true }
    Toggles completion of a lesson, recalculates total progress percentage,
    and auto-generates certificate when 100% is reached!
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        user = request.user
        if not hasattr(user, 'student_profile'):
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            enrollment = CourseEnrollment.objects.select_related('resource', 'student__user').get(
                id=pk,
                student=user.student_profile
            )
        except CourseEnrollment.DoesNotExist:
            return Response({"error": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND)

        lesson_id = request.data.get('lesson_id')
        completed = request.data.get('completed', True)
        last_played = request.data.get('last_played', False)

        if not lesson_id:
            return Response({"error": "lesson_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        completed_list = set(enrollment.completed_lessons or [])

        if completed:
            completed_list.add(lesson_id)
        else:
            completed_list.discard(lesson_id)

        enrollment.completed_lessons = list(completed_list)
        enrollment.last_played_lesson_id = lesson_id

        # Calculate total lessons in course curriculum
        total_lessons = 0
        curriculum = enrollment.resource.curriculum or []
        for mod in curriculum:
            lessons = mod.get('lessons', [])
            total_lessons += len(lessons)

        if total_lessons == 0:
            total_lessons = 1  # Fallback

        progress = min(100, int((len(completed_list) / total_lessons) * 100))
        enrollment.progress_percent = progress

        if progress >= 100 and enrollment.status != EnrollmentStatus.COMPLETED:
            enrollment.status = EnrollmentStatus.COMPLETED
            enrollment.completed_at = timezone.now()
            if not enrollment.certificate_id:
                inst_code = "AKU"
                enrollment.certificate_id = f"CS-{inst_code}-{uuid.uuid4().hex[:8].upper()}"

            # A finished course becomes part of the student's current skill profile.
            # Existing, higher assessment scores are never reduced by course completion.
            student_skill, created = StudentSkill.objects.get_or_create(
                student=enrollment.student,
                skill=enrollment.resource.skill,
                defaults={
                    'score': 70,
                    'source': SkillSource.COURSE,
                    'last_assessed_at': timezone.now(),
                },
            )
            if not created:
                student_skill.score = max(student_skill.score, 70)
                student_skill.last_assessed_at = timezone.now()
                student_skill.save()
            SkillScoreHistory.objects.create(
                student=enrollment.student,
                skill=enrollment.resource.skill,
                score=student_skill.score,
                source=SkillSource.COURSE,
            )

        enrollment.save()

        return Response({
            "message": "Progress updated successfully.",
            "progress_percent": enrollment.progress_percent,
            "completed_lessons": enrollment.completed_lessons,
            "last_played_lesson_id": enrollment.last_played_lesson_id,
            "status": enrollment.status,
            "certificate_id": enrollment.certificate_id,
        }, status=status.HTTP_200_OK)


class StudentResumeDownloadView(APIView):
    """GET /api/courses/resume/download/ -> Download a resume built from the live student profile."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        student, _ = StudentProfile.objects.get_or_create(user=request.user)
        skills = StudentSkill.objects.filter(student=student).select_related('skill').order_by('-score', 'skill__name')
        completed = CourseEnrollment.objects.filter(
            student=student,
            status=EnrollmentStatus.COMPLETED,
        ).select_related('resource', 'resource__skill', 'resource__institution').order_by('-completed_at')

        user = student.user
        full_name = user.full_name or f"{user.first_name} {user.last_name}".strip() or user.email
        education = ' · '.join(part for part in [student.course, student.specialization] if part) or 'Student'
        institution = student.institution.name if student.institution else ''
        contact = ' | '.join(part for part in [user.email, student.linkedin_url, student.github_url] if part)
        skill_items = ''.join(
            f'<li><strong>{escape(item.skill.name)}</strong> — {item.score}% ({escape(item.level)})</li>'
            for item in skills
        ) or '<li>Add skills from the Skills page or complete a course to build this section.</li>'
        course_items = ''.join(
            '<li><strong>{title}</strong> — {skill} · Completed {date}{certificate}</li>'.format(
                title=escape(enrollment.resource.title),
                skill=escape(enrollment.resource.skill.name),
                date=enrollment.completed_at.strftime('%b %Y') if enrollment.completed_at else 'recently',
                certificate=f' · Certificate: {escape(enrollment.certificate_id)}' if enrollment.certificate_id else '',
            )
            for enrollment in completed
        ) or '<li>No completed courses yet.</li>'
        summary = student.bio or f"{education} student pursuing {student.career_goal or 'career opportunities'} with verified learning progress on CareerSync."
        grad = f"Expected graduation: {student.graduation_year}" if student.graduation_year else ''
        html = f'''<!doctype html><html><head><meta charset="utf-8"><title>{escape(full_name)} Resume</title>
        <style>body{{font-family:Arial,sans-serif;color:#18212f;max-width:760px;margin:36px auto;line-height:1.5}}h1{{margin:0;color:#0f766e}}h2{{font-size:15px;letter-spacing:.08em;text-transform:uppercase;border-bottom:2px solid #0f766e;padding-bottom:5px;margin-top:25px}}p{{margin:6px 0}}ul{{padding-left:20px}}.muted{{color:#52616b;font-size:13px}}</style></head><body>
        <h1>{escape(full_name)}</h1><p class="muted">{escape(contact)}</p>
        <h2>Professional Summary</h2><p>{escape(summary)}</p>
        <h2>Education</h2><p><strong>{escape(education)}</strong>{' · ' + escape(institution) if institution else ''}</p><p class="muted">{escape(grad)}</p>
        <h2>Skills</h2><ul>{skill_items}</ul>
        <h2>Completed Courses & Certifications</h2><ul>{course_items}</ul>
        <p class="muted">Generated from CareerSync profile, skills, and course completion records.</p></body></html>'''
        filename = ''.join(char if char.isalnum() else '_' for char in full_name).strip('_') or 'student'
        response = HttpResponse(html, content_type='text/html; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}_CareerSync_Resume.html"'
        return response


class LearningRecommendationListView(generics.ListAPIView):
    """
    GET /api/courses/recommendations/
    """
    serializer_class = LearningRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student_profile = getattr(self.request.user, 'student_profile', None)
        if not student_profile:
            return LearningRecommendation.objects.none()
        return generate_learning_recommendations(student_profile)


class LearningRecommendationDetailView(generics.UpdateAPIView):
    """PATCH /api/courses/recommendations/{id}/ to track a student's recommendation state."""
    serializer_class = LearningRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    http_method_names = ['patch']

    def get_queryset(self):
        student_profile = getattr(self.request.user, 'student_profile', None)
        if not student_profile:
            return LearningRecommendation.objects.none()
        return LearningRecommendation.objects.filter(student=student_profile)

    def perform_update(self, serializer):
        recommendation = serializer.save()
        if recommendation.status == RecommendationStatus.COMPLETED and not recommendation.completed_at:
            recommendation.completed_at = timezone.now()
            recommendation.save(update_fields=['completed_at'])
