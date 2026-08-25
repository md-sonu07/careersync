from django.urls import path
from students.views import StudentProfileView, CandidateListView
from skills.views import (
    StudentSkillListCreateView,
    StudentSkillDetailView,
    StudentSkillHistoryView,
)

urlpatterns = [
    path('profile/', StudentProfileView.as_view(), name='student_profile'),
    path('candidates/', CandidateListView.as_view(), name='candidate_list'),
    path('my-skills/', StudentSkillListCreateView.as_view(), name='student_skill_list_create'),
    path('my-skills/history/', StudentSkillHistoryView.as_view(), name='student_skill_history'),
    path('my-skills/<uuid:pk>/', StudentSkillDetailView.as_view(), name='student_skill_detail'),
]
