from django.urls import path
from students.views import StudentProfileView

urlpatterns = [
    path('profile/', StudentProfileView.as_view(), name='student_profile'),
]
