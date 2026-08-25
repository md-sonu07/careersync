from rest_framework import generics, permissions
from accounts.permissions import IsAcademician
from academicians.models import AcademicianProfile
from academicians.serializers import AcademicianProfileSerializer


class AcademicianProfileView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/academicians/profile/ -> Retrieve academician profile
    PATCH /api/academicians/profile/ -> Update academician profile
    """
    serializer_class = AcademicianProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAcademician]

    def get_object(self):
        profile, created = AcademicianProfile.objects.get_or_create(user=self.request.user)
        return profile
