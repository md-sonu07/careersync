from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from accounts.models import UserRole
from companies.models import Company, Opportunity, OpportunitySkillRequirement, OpportunityType, WorkMode, OpportunityStatus
from skills.models import Skill

User = get_user_model()


class Command(BaseCommand):
    help = "Seed initial opportunities (internships and jobs) for CareerSync"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Opportunities & Skill Benchmarks..."))

        companies_data = [
            {
                "email": "hr@flipkart.com",
                "name": "Flipkart",
                "industry": "E-Commerce / Tech",
                "size": "500+",
                "website": "https://flipkart.com",
                "opportunity": {
                    "title": "Frontend Software Engineering Intern",
                    "type": OpportunityType.INTERNSHIP,
                    "description": "Join Flipkart's core Web UI engineering team. Build high-performance React components.",
                    "location": "Bengaluru (Hybrid)",
                    "work_mode": WorkMode.HYBRID,
                    "duration": "6 months",
                    "stipend": "₹25,000 / month",
                    "status": OpportunityStatus.PUBLISHED,
                    "skills": [
                        {"name": "React.js", "min": 80},
                        {"name": "Python", "min": 60},
                    ]
                }
            },
            {
                "email": "careers@cred.club",
                "name": "CRED",
                "industry": "Fintech / SaaS",
                "size": "201-500",
                "website": "https://cred.club",
                "opportunity": {
                    "title": "React Developer Intern",
                    "type": OpportunityType.INTERNSHIP,
                    "description": "Work with CRED design system and frontend state management architectures.",
                    "location": "Remote",
                    "work_mode": WorkMode.REMOTE,
                    "duration": "6 months",
                    "stipend": "₹28,000 / month",
                    "status": OpportunityStatus.PUBLISHED,
                    "skills": [
                        {"name": "React.js", "min": 82},
                    ]
                }
            },
            {
                "email": "jobs@razorpay.com",
                "name": "Razorpay",
                "industry": "Fintech / Payment Gateway",
                "size": "500+",
                "website": "https://razorpay.com",
                "opportunity": {
                    "title": "Junior Full Stack Developer",
                    "type": OpportunityType.JOB,
                    "description": "Develop scalable payment APIs in Python/Django and React dashboards.",
                    "location": "Bengaluru",
                    "work_mode": WorkMode.ONSITE,
                    "duration": "Full-Time",
                    "stipend": "₹8 - ₹12 LPA",
                    "status": OpportunityStatus.PUBLISHED,
                    "skills": [
                        {"name": "Python", "min": 75},
                        {"name": "Django", "min": 75},
                        {"name": "React.js", "min": 70},
                    ]
                }
            },
            {
                "email": "hiring@postman.com",
                "name": "Postman",
                "industry": "Developer Tools / API Platform",
                "size": "201-500",
                "website": "https://postman.com",
                "opportunity": {
                    "title": "DevOps & Cloud Infrastructure Intern",
                    "type": OpportunityType.INTERNSHIP,
                    "description": "Manage containerization pipelines, Docker builds, and deployment infrastructure.",
                    "location": "Remote",
                    "work_mode": WorkMode.REMOTE,
                    "duration": "6 months",
                    "stipend": "₹30,000 / month",
                    "status": OpportunityStatus.PUBLISHED,
                    "skills": [
                        {"name": "Docker", "min": 75},
                        {"name": "Python", "min": 70},
                    ]
                }
            },
        ]

        for c_item in companies_data:
            user, _ = User.objects.get_or_create(
                email=c_item["email"],
                defaults={
                    "first_name": c_item["name"],
                    "last_name": "Recruiter",
                    "role": UserRole.INDUSTRY,
                    "is_active": True,
                }
            )
            user.set_password("Password123!")
            user.save()

            company, _ = Company.objects.get_or_create(
                user=user,
                defaults={
                    "company_name": c_item["name"],
                    "official_email": c_item["email"],
                    "website": c_item["website"],
                    "industry_type": c_item["industry"],
                    "is_verified": True,
                }
            )

            opp_data = c_item["opportunity"]
            opportunity, created = Opportunity.objects.get_or_create(
                company=company,
                title=opp_data["title"],
                defaults={
                    "opportunity_type": opp_data["type"],
                    "description": opp_data["description"],
                    "location": opp_data["location"],
                    "work_mode": opp_data["work_mode"],
                    "duration": opp_data["duration"],
                    "stipend_salary": opp_data["stipend"],
                    "status": opp_data["status"],
                }
            )

            status_str = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] Opportunity ({status_str}): {opportunity.title} @ {company.company_name}"))

            if created:
                for req in opp_data["skills"]:
                    try:
                        skill = Skill.objects.get(name=req["name"])
                        OpportunitySkillRequirement.objects.create(
                            opportunity=opportunity,
                            skill=skill,
                            minimum_score=req["min"]
                        )
                    except Skill.DoesNotExist:
                        continue

        self.stdout.write(self.style.SUCCESS("\n=================================================="))
        self.stdout.write(self.style.SUCCESS("Opportunities & Benchmarks Seeded Successfully!"))
        self.stdout.write(self.style.SUCCESS("==================================================\n"))
