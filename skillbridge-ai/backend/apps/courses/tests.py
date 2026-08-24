from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import UserRole
from students.models import StudentProfile
from skills.models import Skill, SkillCategory, CareerRole, CareerSkillRequirement, StudentSkill
from assessments.models import DifficultyLevel
from courses.models import LearningResource, LearningRecommendation, ResourceType, RecommendationPriority

User = get_user_model()


class CoursesAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.skill_python = Skill.objects.create(
            name="Python",
            category=SkillCategory.PROGRAMMING,
            description="Python language"
        )
        self.role_backend = CareerRole.objects.create(
            title="Backend Developer",
            category="Web Development",
            description="Backend role"
        )
        CareerSkillRequirement.objects.create(
            career_role=self.role_backend,
            skill=self.skill_python,
            required_score=85
        )

        self.resource = LearningResource.objects.create(
            title="Python Advanced Course",
            description="Learn advanced python",
            skill=self.skill_python,
            level=DifficultyLevel.ADVANCED,
            resource_type=ResourceType.COURSE,
            content_url="https://careersync.ai/course/python"
        )

        self.student_user = User.objects.create_user(
            email="student_courses@careersync.ai",
            password="Password123!",
            first_name="Course",
            last_name="Student",
            role=UserRole.STUDENT
        )
        self.student_profile = StudentProfile.objects.create(user=self.student_user)

    def test_list_learning_resources(self):
        response = self.client.get('/api/courses/resources/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Python Advanced Course")

    def test_learning_recommendation_engine_flow(self):
        self.client.force_authenticate(user=self.student_user)

        # 1. Fetch recommendations (Python required 85, student has 0 => gap 85 => High priority recommendation)
        res_rec = self.client.get('/api/courses/recommendations/')
        self.assertEqual(res_rec.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_rec.data), 1)
        self.assertEqual(res_rec.data[0]['priority'], 'high')
        rec_id = res_rec.data[0]['id']

        # 2. Update recommendation status to in_progress
        res_patch = self.client.patch(f'/api/courses/recommendations/{rec_id}/', {
            'status': 'in_progress'
        })
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data['status'], 'in_progress')
