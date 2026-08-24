from django.urls import path
from skills.views import (
    SkillListCreateView,
    CareerRoleListView,
    StudentSkillListCreateView,
    StudentSkillDetailView,
    StudentSkillHistoryView,
)

urlpatterns = [
    path('', SkillListCreateView.as_view(), name='skill_list_create'),
    path('career-roles/', CareerRoleListView.as_view(), name='career_role_list'),
    path('my-skills/', StudentSkillListCreateView.as_view(), name='student_skill_list_create'),
    path('my-skills/history/', StudentSkillHistoryView.as_view(), name='student_skill_history'),
    path('my-skills/<uuid:pk>/', StudentSkillDetailView.as_view(), name='student_skill_detail'),
]
