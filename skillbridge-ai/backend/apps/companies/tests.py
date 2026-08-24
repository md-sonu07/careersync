from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import UserRole
from students.models import StudentProfile
from companies.models import (
    Company,
    Opportunity,
    OpportunitySkillRequirement,
    OpportunityType,
    WorkMode,
    OpportunityStatus,
    Application,
    ApplicationStatus,
    ApplicationStatusHistory,
)
from skills.models import Skill, SkillCategory, StudentSkill

User = get_user_model()


class OpportunityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.skill_python = Skill.objects.create(
            name="Python",
            category=SkillCategory.PROGRAMMING
        )

        # Student User
        self.student_user = User.objects.create_user(
            email="match_student@careersync.ai",
            password="Password123!",
            first_name="Match",
            last_name="Student",
            role=UserRole.STUDENT
        )
        self.student_profile = StudentProfile.objects.create(user=self.student_user)
        StudentSkill.objects.create(
            student=self.student_profile,
            skill=self.skill_python,
            score=80
        )

        # Company 1 (Owner)
        self.user_company1 = User.objects.create_user(
            email="recruiter1@flipkart.com",
            password="Password123!",
            first_name="Flipkart",
            last_name="Recruiter",
            role=UserRole.INDUSTRY
        )
        self.company1 = Company.objects.create(
            user=self.user_company1,
            company_name="Flipkart",
            official_email="recruiter1@flipkart.com"
        )

        # Company 2 (Attacker)
        self.user_company2 = User.objects.create_user(
            email="recruiter2@amazon.com",
            password="Password123!",
            first_name="Amazon",
            last_name="Recruiter",
            role=UserRole.INDUSTRY
        )
        self.company2 = Company.objects.create(
            user=self.user_company2,
            company_name="Amazon",
            official_email="recruiter2@amazon.com"
        )

        # Opportunity created by Company 1 (requires Python score 80)
        self.opportunity = Opportunity.objects.create(
            company=self.company1,
            title="Frontend Intern",
            opportunity_type=OpportunityType.INTERNSHIP,
            description="React & Python intern",
            location="Bengaluru",
            work_mode=WorkMode.HYBRID,
            status=OpportunityStatus.PUBLISHED
        )
        OpportunitySkillRequirement.objects.create(
            opportunity=self.opportunity,
            skill=self.skill_python,
            minimum_score=80
        )

    def test_list_opportunities(self):
        response = self.client.get('/api/opportunities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Frontend Intern")

    def test_create_opportunity_by_company(self):
        self.client.force_authenticate(user=self.user_company1)
        res = self.client.post('/api/opportunities/', {
            'title': 'Backend Software Engineer',
            'opportunity_type': 'job',
            'description': 'Python & Django role',
            'location': 'Remote',
            'work_mode': 'remote',
            'stipend_salary': '₹12 LPA',
            'status': 'published',
            'skill_requirements': [
                {'skill_id': str(self.skill_python.id), 'minimum_score': 80}
            ]
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['title'], "Backend Software Engineer")
        self.assertEqual(len(res.data['skill_requirements']), 1)

    def test_security_only_owning_company_can_edit(self):
        # Company 2 tries to edit Company 1's opportunity
        self.client.force_authenticate(user=self.user_company2)
        patch_res = self.client.patch(f'/api/opportunities/{self.opportunity.id}/', {
            'title': 'Hacked Title'
        })
        self.assertEqual(patch_res.status_code, status.HTTP_403_FORBIDDEN)

        # Company 1 edits its own opportunity
        self.client.force_authenticate(user=self.user_company1)
        owner_patch_res = self.client.patch(f'/api/opportunities/{self.opportunity.id}/', {
            'title': 'Updated Frontend Intern'
        })
        self.assertEqual(owner_patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(owner_patch_res.data['title'], 'Updated Frontend Intern')

    def test_opportunity_matching_engine_flow(self):
        self.client.force_authenticate(user=self.student_user)

        # Student has Python score 80, requirement is 80 => Expect 100% match
        res_matches = self.client.get('/api/opportunities/matches/')
        self.assertEqual(res_matches.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_matches.data), 1)
        self.assertEqual(res_matches.data[0]['match_score'], 100.0)

    def test_student_application_flow_and_unique_constraint(self):
        self.client.force_authenticate(user=self.student_user)

        # 1. Submit application
        res_app = self.client.post(f'/api/opportunities/{self.opportunity.id}/apply/', {
            'cover_letter': 'I am excited to apply for this internship.'
        })
        self.assertEqual(res_app.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_app.data['status'], 'applied')
        app_id = res_app.data['id']

        # 2. Duplicate application attempt => Expect 400 Bad Request
        res_dup = self.client.post(f'/api/opportunities/{self.opportunity.id}/apply/', {
            'cover_letter': 'Second attempt'
        })
        self.assertEqual(res_dup.status_code, status.HTTP_400_BAD_REQUEST)

        # 3. List student applications
        res_my_apps = self.client.get('/api/applications/my/')
        self.assertEqual(res_my_apps.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_my_apps.data), 1)
        self.assertEqual(res_my_apps.data[0]['id'], app_id)

    def test_company_application_review_and_status_history(self):
        # Student creates application
        app = Application.objects.create(
            student=self.student_profile,
            opportunity=self.opportunity,
            cover_letter='Cover letter',
            status=ApplicationStatus.APPLIED
        )
        ApplicationStatusHistory.objects.create(
            application=app,
            old_status='',
            new_status=ApplicationStatus.APPLIED,
            changed_by=self.student_user,
            remarks='Applied'
        )

        # Company recruiter logs in
        self.client.force_authenticate(user=self.user_company1)
        res_company_apps = self.client.get('/api/company/applications/')
        self.assertEqual(res_company_apps.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_company_apps.data), 1)

        # Recruiter updates status to shortlisted
        res_status = self.client.patch(f'/api/applications/{app.id}/status/', {
            'status': 'shortlisted',
            'remarks': 'Great profile fit.'
        }, format='json')

        self.assertEqual(res_status.status_code, status.HTTP_200_OK)
        self.assertEqual(res_status.data['status'], 'shortlisted')
        self.assertEqual(len(res_status.data['status_history']), 2)
