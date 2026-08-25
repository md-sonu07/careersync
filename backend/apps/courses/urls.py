from django.urls import path
from courses.views import (
    LearningResourceListView,
    LearningResourceDetailView,
    MyInstituteCoursesView,
    CourseEnrollView,
    MyEnrollmentsView,
    EnrollmentDetailView,
    UpdateCourseProgressView,
    LearningRecommendationListView,
)

urlpatterns = [
    path('resources/', LearningResourceListView.as_view(), name='learning_resource_list'),
    path('resources/my/', MyInstituteCoursesView.as_view(), name='my_institute_courses'),
    path('resources/<uuid:pk>/', LearningResourceDetailView.as_view(), name='learning_resource_detail'),
    path('resources/<uuid:pk>/enroll/', CourseEnrollView.as_view(), name='course_enroll'),
    
    path('my-enrollments/', MyEnrollmentsView.as_view(), name='my_course_enrollments'),
    path('enrollments/<uuid:pk>/', EnrollmentDetailView.as_view(), name='enrollment_detail'),
    path('enrollments/<uuid:pk>/progress/', UpdateCourseProgressView.as_view(), name='update_course_progress'),

    path('recommendations/', LearningRecommendationListView.as_view(), name='learning_recommendation_list'),
]
