from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserRole
from students.models import StudentProfile

User = get_user_model()


class StudentProfileAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="student@example.com",
            password="Password123!",
            first_name="Student",
            last_name="User",
            role=UserRole.STUDENT
        )
        self.client.force_authenticate(user=self.user)

    def test_get_student_profile(self):
        response = self.client.get('/api/students/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], "student@example.com")

    def test_patch_student_profile(self):
        payload = {
            "course": "B.Tech Computer Science",
            "semester": 6,
            "graduation_year": 2026,
            "bio": "Enthusiastic software engineer student."
        }
        response = self.client.patch('/api/students/profile/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['course'], "B.Tech Computer Science")
        self.assertEqual(response.data['semester'], 6)
