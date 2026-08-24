from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from accounts.permissions import IsStudent
from students.models import StudentProfile
from courses.models import LearningResource, LearningRecommendation
from courses.serializers import (
    LearningResourceSerializer,
    LearningRecommendationSerializer,
    LearningRecommendationUpdateSerializer,
)
from courses.services.recommendation_engine import generate_learning_recommendations


class LearningResourceListView(generics.ListAPIView):
    """
    GET /api/courses/resources/ -> List active learning resources (filterable by ?skill=, ?type=, ?level=)
    """
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = LearningResource.objects.filter(is_active=True)
        skill_param = self.request.query_params.get('skill')
        resource_type = self.request.query_params.get('type')
        level = self.request.query_params.get('level')
        search = self.request.query_params.get('search')

        if skill_param:
            queryset = queryset.filter(Q(skill__name__icontains=skill_param) | Q(skill__id__iexact=skill_param))
        if resource_type:
            queryset = queryset.filter(resource_type__iexact=resource_type)
        if level:
            queryset = queryset.filter(level__iexact=level)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))

        return queryset


class LearningRecommendationListView(generics.ListAPIView):
    """
    GET /api/courses/recommendations/ -> Personalized recommendations for student
    """
    serializer_class = LearningRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return generate_learning_recommendations(student)


class LearningRecommendationDetailView(generics.UpdateAPIView):
    """
    PATCH /api/courses/recommendations/{id}/ -> Update recommendation status (pending, in_progress, completed)
    """
    serializer_class = LearningRecommendationUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    lookup_field = 'pk'

    def get_queryset(self):
        student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return LearningRecommendation.objects.filter(student=student)
