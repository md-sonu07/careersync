from django.urls import path
from analytics.views import (
    StudentAnalyticsView,
    CompanyAnalyticsView,
    AcademicianAnalyticsView,
)

urlpatterns = [
    path('student/', StudentAnalyticsView.as_view(), name='student_analytics'),
    path('company/', CompanyAnalyticsView.as_view(), name='company_analytics'),
    path('academician/', AcademicianAnalyticsView.as_view(), name='academician_analytics'),
]
