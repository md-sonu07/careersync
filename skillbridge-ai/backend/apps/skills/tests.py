from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import UserRole
from students.models import StudentProfile
from skills.models import Skill, SkillCategory, CareerRole, CareerSkillRequirement, StudentSkill

User = get_user_model()


class SkillModelAndAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.skill_python = Skill.objects.create(
            name="Python",
            category=SkillCategory.PROGRAMMING,
            description="Python programming language"
        )
        self.skill_react = Skill.objects.create(
            name="React.js",
            category=SkillCategory.FRONTEND,
            description="React frontend framework"
        )
        self.role_fullstack = CareerRole.objects.create(
            title="Full Stack Developer",
            category="Web Development",
            description="Full Stack role"
        )
        CareerSkillRequirement.objects.create(
            career_role=self.role_fullstack,
            skill=self.skill_python,
            required_score=80
        )

        # Create test student user
        self.student_user = User.objects.create_user(
            email="student_test@skillbridge.ai",
            password="Password123!",
            first_name="Test",
            last_name="Student",
            role=UserRole.STUDENT
        )
        self.student_profile = StudentProfile.objects.create(user=self.student_user)

    def test_list_skills(self):
        response = self.client.get('/api/skills/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_skills_by_category(self):
        response = self.client.get('/api/skills/?category=Frontend')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "React.js")

    def test_list_career_roles(self):
        response = self.client.get('/api/skills/career-roles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Full Stack Developer")
        self.assertEqual(len(response.data[0]['skill_requirements']), 1)

    def test_student_my_skills_flow(self):
        # Authenticate student
        self.client.force_authenticate(user=self.student_user)

        # 1. Get initial skills (empty)
        res_get = self.client.get('/api/students/my-skills/')
        self.assertEqual(res_get.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_get.data), 0)

        # 2. Add Python skill
        res_add = self.client.post('/api/students/my-skills/', {
            'skill_id': str(self.skill_python.id),
            'score': 85,
            'level': 'Advanced',
            'source': 'manual'
        })
        self.assertEqual(res_add.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_add.data['score'], 85)
        skill_entry_id = res_add.data['id']

        # 3. Update skill score
        res_patch = self.client.patch(f'/api/students/my-skills/{skill_entry_id}/', {
            'score': 90,
            'level': 'Expert'
        })
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data['score'], 90)

        # 4. Check history log
        res_history = self.client.get('/api/students/my-skills/history/')
        self.assertEqual(res_history.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res_history.data), 2)
