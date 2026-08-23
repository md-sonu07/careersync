from rest_framework import generics, permissions
from accounts.permissions import IsIndustry
from companies.models import Company
from companies.serializers import CompanySerializer


class CompanyProfileView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/companies/profile/ -> Retrieve company profile
    PATCH /api/companies/profile/ -> Update company profile
    """
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsIndustry]

    def get_object(self):
        company_name_default = f"{self.request.user.first_name}'s Company".strip()
        profile, created = Company.objects.get_or_create(
            user=self.request.user,
            defaults={'company_name': company_name_default, 'official_email': self.request.user.email}
        )
        return profile
