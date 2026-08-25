from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import UserRole
from students.models import StudentProfile
from companies.models import Company, Opportunity, OpportunityType, WorkMode, OpportunityStatus
from skills.models import Skill, SkillCategory, StudentSkill

User = get_user_model()


class AnalyticsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.skill_python = Skill.objects.create(
            name="Python",
            category=SkillCategory.PROGRAMMING
        )

        # Student
        self.student_user = User.objects.create_user(
            email="analytics_student@careersync.ai",
            password="Password123!",
            first_name="Analytics",
            last_name="Student",
            role=UserRole.STUDENT
        )
        self.student_profile = StudentProfile.objects.create(user=self.student_user)
        StudentSkill.objects.create(
            student=self.student_profile,
            skill=self.skill_python,
            score=85,
            is_verified=True
        )

        # Company Recruiter
        self.user_company = User.objects.create_user(
            email="recruiter_analytics@flipkart.com",
            password="Password123!",
            first_name="Flipkart",
            role=UserRole.INDUSTRY
        )
        self.company = Company.objects.create(
            user=self.user_company,
            company_name="Flipkart"
        )
        Opportunity.objects.create(
            company=self.company,
            title="Frontend Intern",
            opportunity_type=OpportunityType.INTERNSHIP,
            description="Role",
            status=OpportunityStatus.PUBLISHED
        )

        # Academician User
        self.user_academician = User.objects.create_user(
            email="prof@university.edu",
            password="Password123!",
            first_name="Professor",
            role=UserRole.ACADEMICIAN
        )

    def test_student_analytics(self):
        self.client.force_authenticate(user=self.student_user)
        res = self.client.get('/api/analytics/student/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('career_readiness', res.data)
        self.assertEqual(res.data['career_readiness']['score_percentage'], 85.0)

    def test_company_analytics(self):
        self.client.force_authenticate(user=self.user_company)
        res = self.client.get('/api/analytics/company/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['active_opportunities'], 1)

    def test_academician_analytics(self):
        self.client.force_authenticate(user=self.user_academician)
        res = self.client.get('/api/analytics/academician/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('total_students', res.data)
        self.assertEqual(res.data['total_students'], 1)
