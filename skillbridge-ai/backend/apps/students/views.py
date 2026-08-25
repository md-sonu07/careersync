from rest_framework import generics, permissions, status
from rest_framework.response import Response
from accounts.permissions import IsStudent
from students.models import StudentProfile
from students.serializers import StudentProfileSerializer


class StudentProfileView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/students/profile/ -> Get authenticated student's profile
    PATCH /api/students/profile/ -> Update authenticated student's profile
    """
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_object(self):
        profile, created = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile


class CandidateListView(generics.ListAPIView):
    """
    GET /api/students/candidates/ -> List all student candidate profiles
    """
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentProfile.objects.all()
