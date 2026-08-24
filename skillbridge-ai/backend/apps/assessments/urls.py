from django.urls import path
from assessments.views import (
    AssessmentListView,
    AssessmentDetailView,
    StartAssessmentAttemptView,
    SubmitAssessmentAttemptView,
    StudentAssessmentAttemptHistoryView,
)

urlpatterns = [
    path('', AssessmentListView.as_view(), name='assessment_list'),
    path('my-attempts/', StudentAssessmentAttemptHistoryView.as_view(), name='student_assessment_history'),
    path('<uuid:pk>/', AssessmentDetailView.as_view(), name='assessment_detail'),
    path('<uuid:pk>/start/', StartAssessmentAttemptView.as_view(), name='assessment_start'),
    path('attempts/<uuid:attempt_id>/submit/', SubmitAssessmentAttemptView.as_view(), name='assessment_submit'),
]
