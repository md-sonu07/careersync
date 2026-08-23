from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from institutions.models import Institution, InstitutionType


class InstitutionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.institution = Institution.objects.create(
            name="Delhi Technological University",
            institution_type=InstitutionType.UNIVERSITY,
            city="Delhi",
            state="Delhi",
            country="India"
        )

    def test_list_institutions(self):
        response = self.client.get('/api/institutions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Delhi Technological University")
