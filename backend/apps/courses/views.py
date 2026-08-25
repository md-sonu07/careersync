import uuid
from decimal import Decimal
from django.db import transaction
from django.db.models import Q, F
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
)
from courses.serializers import (
    LearningResourceSerializer,
    CourseEnrollmentSerializer,
    CoursePaymentSerializer,
    LearningRecommendationSerializer,
)
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

        enrollment.save()

        return Response({
            "message": "Progress updated successfully.",
            "progress_percent": enrollment.progress_percent,
            "completed_lessons": enrollment.completed_lessons,
            "last_played_lesson_id": enrollment.last_played_lesson_id,
            "status": enrollment.status,
            "certificate_id": enrollment.certificate_id,
        }, status=status.HTTP_200_OK)


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
