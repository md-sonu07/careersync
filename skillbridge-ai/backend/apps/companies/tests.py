from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserRole
from companies.models import Company

User = get_user_model()


class CompanyProfileAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="recruiter@techcorp.com",
            password="Password123!",
            first_name="Tech",
            last_name="Recruiter",
            role=UserRole.INDUSTRY
        )
        self.client.force_authenticate(user=self.user)

    def test_get_company_profile(self):
        response = self.client.get('/api/companies/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], "recruiter@techcorp.com")

    def test_patch_company_profile(self):
        payload = {
            "company_name": "Tech Corp AI",
            "industry_type": "Information Technology",
            "website": "https://techcorp.ai"
        }
        response = self.client.patch('/api/companies/profile/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], "Tech Corp AI")
        self.assertEqual(response.data['industry_type'], "Information Technology")
