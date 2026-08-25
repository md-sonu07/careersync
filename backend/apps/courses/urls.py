from django.urls import path
from courses.views import (
    LearningResourceListView,
    LearningRecommendationListView,
    LearningRecommendationDetailView,
)

urlpatterns = [
    path('resources/', LearningResourceListView.as_view(), name='learning_resource_list'),
    path('recommendations/', LearningRecommendationListView.as_view(), name='learning_recommendation_list'),
    path('recommendations/<uuid:pk>/', LearningRecommendationDetailView.as_view(), name='learning_recommendation_detail'),
]
