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
    GET /api/students/candidates/ -> List all student candidate profiles.
    - For Academicians / Institutions: Scoped to students enrolled in their institution.
    - For Companies & Admins: Returns all candidate profiles.
    """
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'academician':
            if hasattr(user, 'academician_profile') and user.academician_profile.institution:
                return StudentProfile.objects.filter(institution=user.academician_profile.institution)
            return StudentProfile.objects.none()
        return StudentProfile.objects.all()
