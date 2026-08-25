from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserRole

User = get_user_model()


class AuthenticationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.me_url = '/api/auth/me/'
        self.logout_url = '/api/auth/logout/'

        self.student_data = {
            "email": "student@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "role": UserRole.STUDENT,
            "password": "Password123!",
            "confirm_password": "Password123!"
        }

    def test_student_registration_success(self):
        response = self.client.post(self.register_url, self.student_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'student@example.com')
        self.assertEqual(response.data['user']['role'], UserRole.STUDENT)

    def test_registration_duplicate_email_fails(self):
        self.client.post(self.register_url, self.student_data, format='json')
        response = self.client.post(self.register_url, self.student_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_registration_password_mismatch_fails(self):
        bad_data = self.student_data.copy()
        bad_data['confirm_password'] = 'DifferentPassword123!'
        response = self.client.post(self.register_url, bad_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data)

    def test_login_success(self):
        # Register user first
        self.client.post(self.register_url, self.student_data, format='json')

        login_payload = {
            "email": "student@example.com",
            "password": "Password123!"
        }
        response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'student@example.com')

    def test_get_user_profile_authenticated(self):
        reg_resp = self.client.post(self.register_url, self.student_data, format='json')
        access_token = reg_resp.data['tokens']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'student@example.com')

    def test_get_user_profile_unauthenticated_fails(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_blacklists_token(self):
        reg_resp = self.client.post(self.register_url, self.student_data, format='json')
        access_token = reg_resp.data['tokens']['access']
        refresh_token = reg_resp.data['tokens']['refresh']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_resp = self.client.post(self.logout_url, {"refresh": refresh_token}, format='json')
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(logout_resp.data['message'], 'Logged out successfully')
