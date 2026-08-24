from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from accounts.permissions import IsStudent
from students.models import StudentProfile
from skills.models import Skill, CareerRole, StudentSkill, SkillScoreHistory, SkillGap
from skills.serializers import (
    SkillSerializer,
    CareerRoleSerializer,
    StudentSkillSerializer,
    StudentSkillCreateSerializer,
    SkillScoreHistorySerializer,
    SkillGapSerializer,
)
from skills.services.gap_engine import calculate_student_skill_gaps


class SkillListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/skills/  -> List all active skills (filterable by category or search term)
    POST /api/skills/  -> Add a new skill definition
    """
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Skill.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category__iexact=category)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))

        return queryset


class CareerRoleListView(generics.ListAPIView):
    """
    GET /api/skills/career-roles/ -> List all active career roles with target skill benchmarks
    """
    serializer_class = CareerRoleSerializer
    permission_classes = [permissions.AllowAny]
    queryset = CareerRole.objects.filter(is_active=True)


class StudentSkillListCreateView(APIView):
    """
    GET  /api/students/my-skills/  -> Get authenticated student's skills
    POST /api/students/my-skills/  -> Add or update a skill on student profile
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_student_profile(self, request):
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        return profile

    def get(self, request):
        student = self.get_student_profile(request)
        skills = StudentSkill.objects.filter(student=student)
        serializer = StudentSkillSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        student = self.get_student_profile(request)
        serializer = StudentSkillCreateSerializer(data=request.data, context={'student': student})
        serializer.is_valid(raise_exception=True)
        student_skill = serializer.save()

        response_serializer = StudentSkillSerializer(student_skill)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class StudentSkillDetailView(APIView):
    """
    PATCH  /api/students/my-skills/{id}/ -> Update score or level of student skill
    DELETE /api/students/my-skills/{id}/ -> Remove skill from student profile
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_object(self, request, pk):
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        return generics.get_object_or_404(StudentSkill, id=pk, student=profile)

    def patch(self, request, pk):
        student_skill = self.get_object(request, pk)
        score = request.data.get('score', student_skill.score)
        source = request.data.get('source', student_skill.source)
        is_verified = request.data.get('is_verified', student_skill.is_verified)

        student_skill.score = int(score)
        student_skill.source = source
        student_skill.is_verified = is_verified
        if source in ['assessment', 'practice'] or 'score' in request.data:
            from django.utils import timezone
            student_skill.last_assessed_at = timezone.now()

        student_skill.save()

        # Log history
        SkillScoreHistory.objects.create(
            student=student_skill.student,
            skill=student_skill.skill,
            score=student_skill.score,
            source=source
        )

        serializer = StudentSkillSerializer(student_skill)
        return Response(serializer.data)

    def delete(self, request, pk):
        student_skill = self.get_object(request, pk)
        student_skill.delete()
        return Response({"message": "Skill removed successfully"}, status=status.HTTP_204_NO_CONTENT)


class StudentSkillHistoryView(generics.ListAPIView):
    """
    GET /api/students/my-skills/history/ -> Progress history of student skills
    """
    serializer_class = SkillScoreHistorySerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return SkillScoreHistory.objects.filter(student=student)


class StudentSkillGapView(APIView):
    """
    GET  /api/skills/gaps/ -> Calculates & returns authenticated student's skill gaps
    POST /api/skills/gaps/recalculate/ -> Force recalculates skill gaps
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        student, _ = StudentProfile.objects.get_or_create(user=request.user)
        role_id = request.query_params.get('career_role_id')
        career_role = None
        if role_id:
            career_role = generics.get_object_or_404(CareerRole, id=role_id)

        gaps = calculate_student_skill_gaps(student, career_role)
        serializer = SkillGapSerializer(gaps, many=True)
        return Response(serializer.data)

    def post(self, request):
        student, _ = StudentProfile.objects.get_or_create(user=request.user)
        role_id = request.data.get('career_role_id')
        career_role = None
        if role_id:
            career_role = generics.get_object_or_404(CareerRole, id=role_id)

        gaps = calculate_student_skill_gaps(student, career_role)
        serializer = SkillGapSerializer(gaps, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
