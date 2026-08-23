from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserRole
from academicians.models import AcademicianProfile

User = get_user_model()


class AcademicianProfileAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="prof@university.edu",
            password="Password123!",
            first_name="Alan",
            last_name="Turing",
            role=UserRole.ACADEMICIAN
        )
        self.client.force_authenticate(user=self.user)

    def test_get_academician_profile(self):
        response = self.client.get('/api/academicians/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], "prof@university.edu")

    def test_patch_academician_profile(self):
        payload = {
            "designation": "Associate Professor",
            "department": "Computer Science & Engineering"
        }
        response = self.client.patch('/api/academicians/profile/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['designation'], "Associate Professor")
        self.assertEqual(response.data['department'], "Computer Science & Engineering")
