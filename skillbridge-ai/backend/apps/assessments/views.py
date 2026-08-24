from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from accounts.permissions import IsStudent
from students.models import StudentProfile
from assessments.models import (
    Assessment,
    Question,
    QuestionOption,
    AssessmentAttempt,
    AttemptStatus,
    StudentAnswer,
)
from assessments.serializers import (
    AssessmentListSerializer,
    AssessmentDetailSerializer,
    AssessmentAttemptSerializer,
    SubmitAssessmentSerializer,
)
from assessments.services import calculate_assessment_result


class AssessmentListView(generics.ListAPIView):
    """
    GET /api/assessments/ -> List active assessments (filterable by ?skill=... or ?difficulty=...)
    """
    serializer_class = AssessmentListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Assessment.objects.filter(is_active=True)
        skill_param = self.request.query_params.get('skill')
        difficulty = self.request.query_params.get('difficulty')
        search = self.request.query_params.get('search')

        if skill_param:
            queryset = queryset.filter(Q(skill__name__icontains=skill_param) | Q(skill__id__iexact=skill_param))
        if difficulty:
            queryset = queryset.filter(difficulty__iexact=difficulty)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))

        return queryset


class AssessmentDetailView(generics.RetrieveAPIView):
    """
    GET /api/assessments/{id}/ -> Retrieve assessment and questions (without is_correct field)
    """
    serializer_class = AssessmentDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Assessment.objects.filter(is_active=True)
    lookup_field = 'pk'


class StartAssessmentAttemptView(APIView):
    """
    POST /api/assessments/{id}/start/ -> Create a new AssessmentAttempt for authenticated student
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, pk):
        assessment = generics.get_object_or_404(Assessment, id=pk, is_active=True)
        student, _ = StudentProfile.objects.get_or_create(user=request.user)

        attempt = AssessmentAttempt.objects.create(
            student=student,
            assessment=assessment,
            status=AttemptStatus.STARTED
        )

        serializer = AssessmentAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubmitAssessmentAttemptView(APIView):
    """
    POST /api/assessments/attempts/{attempt_id}/submit/ -> Submit student answers & calculate result
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, attempt_id):
        student, _ = StudentProfile.objects.get_or_create(user=request.user)
        attempt = generics.get_object_or_404(AssessmentAttempt, id=attempt_id, student=student)

        if attempt.status == AttemptStatus.COMPLETED:
            return Response(
                {"detail": "This attempt has already been submitted and completed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SubmitAssessmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers_data = serializer.validated_data['answers']

        # Clear existing draft answers if any
        StudentAnswer.objects.filter(attempt=attempt).delete()

        for item in answers_data:
            q_id = item['question_id']
            opt_id = item['selected_option_id']

            try:
                question = Question.objects.get(id=q_id, assessment=attempt.assessment)
                option = QuestionOption.objects.get(id=opt_id, question=question)

                StudentAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_option=option
                )
            except (Question.DoesNotExist, QuestionOption.DoesNotExist):
                continue

        # Phase 7 Result calculation service
        completed_attempt = calculate_assessment_result(attempt)

        response_serializer = AssessmentAttemptSerializer(completed_attempt)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class StudentAssessmentAttemptHistoryView(generics.ListAPIView):
    """
    GET /api/assessments/my-attempts/ -> List past assessment attempts of student
    """
    serializer_class = AssessmentAttemptSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return AssessmentAttempt.objects.filter(student=student)
