from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import UserRole
from students.models import StudentProfile
from skills.models import Skill, SkillCategory, StudentSkill
from assessments.models import (
    Assessment,
    Question,
    QuestionOption,
    AssessmentAttempt,
    AttemptStatus,
    DifficultyLevel,
)

User = get_user_model()


class AssessmentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.skill = Skill.objects.create(
            name="Python",
            category=SkillCategory.PROGRAMMING,
            description="Python language"
        )
        self.assessment = Assessment.objects.create(
            title="Python Basics",
            skill=self.skill,
            difficulty=DifficultyLevel.BEGINNER,
            time_limit=10,
            total_marks=100
        )
        self.q1 = Question.objects.create(
            assessment=self.assessment,
            skill=self.skill,
            question_text="What is 2+2?",
            difficulty=DifficultyLevel.BEGINNER,
            explanation="2+2=4"
        )
        self.opt1_correct = QuestionOption.objects.create(
            question=self.q1,
            option_text="4",
            is_correct=True
        )
        self.opt1_wrong = QuestionOption.objects.create(
            question=self.q1,
            option_text="5",
            is_correct=False
        )

        self.student_user = User.objects.create_user(
            email="student_assess@careersync.ai",
            password="Password123!",
            first_name="Assess",
            last_name="Student",
            role=UserRole.STUDENT
        )
        self.student_profile = StudentProfile.objects.create(user=self.student_user)

    def test_list_assessments(self):
        response = self.client.get('/api/assessments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Python Basics")

    def test_assessment_detail_security(self):
        # Security test: is_correct MUST NOT be present in options list
        response = self.client.get(f'/api/assessments/{self.assessment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questions = response.data['questions']
        self.assertEqual(len(questions), 1)
        options = questions[0]['options']
        self.assertEqual(len(options), 2)
        self.assertNotIn('is_correct', options[0])

    def test_assessment_attempt_submission_flow(self):
        self.client.force_authenticate(user=self.student_user)

        # 1. Start attempt
        start_res = self.client.post(f'/api/assessments/{self.assessment.id}/start/')
        self.assertEqual(start_res.status_code, status.HTTP_201_CREATED)
        attempt_id = start_res.data['id']

        # 2. Submit correct answer
        submit_res = self.client.post(f'/api/assessments/attempts/{attempt_id}/submit/', {
            'answers': [
                {
                    'question_id': str(self.q1.id),
                    'selected_option_id': str(self.opt1_correct.id)
                }
            ]
        }, format='json')

        self.assertEqual(submit_res.status_code, status.HTTP_200_OK)
        self.assertEqual(submit_res.data['percentage'], 100.0)
        self.assertEqual(submit_res.data['status'], 'completed')

        # 3. Verify StudentSkill update
        student_skill = StudentSkill.objects.get(student=self.student_profile, skill=self.skill)
        self.assertEqual(student_skill.score, 100)
        self.assertEqual(student_skill.level, 'Expert')
        self.assertTrue(student_skill.is_verified)
