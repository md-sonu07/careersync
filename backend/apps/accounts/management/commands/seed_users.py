from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

from accounts.models import UserRole
from institutions.models import Institution
from students.models import StudentProfile
from companies.models import Company, CompanySize
from academicians.models import AcademicianProfile

User = get_user_model()


class Command(BaseCommand):
    help = "Seed initial database with users across all roles (Admin, Student, Industry, Academician)"

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear seeded user accounts before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING("Clearing existing seeded test users..."))
            seed_emails = [
                'admin@skillbridge.ai',
                'student@skillbridge.ai',
                'rahul.verma@college.edu',
                'industry@skillbridge.ai',
                'recruiter@nexuscorp.com',
                'academia@skillbridge.ai',
                'faculty@dtu.ac.in',
            ]
            User.objects.filter(email__in=seed_emails).delete()
            self.stdout.write(self.style.SUCCESS("Cleared existing seeded users."))

        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Institutions..."))
        iitb, _ = Institution.objects.get_or_create(
            name="IIT Bombay",
            defaults={
                "website": "https://iitb.ac.in",
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India",
                "is_verified": True,
            }
        )
        dtu, _ = Institution.objects.get_or_create(
            name="Delhi Technological University (DTU)",
            defaults={
                "website": "https://dtu.ac.in",
                "city": "New Delhi",
                "state": "Delhi",
                "country": "India",
                "is_verified": True,
            }
        )
        bits, _ = Institution.objects.get_or_create(
            name="BITS Pilani",
            defaults={
                "website": "https://bits-pilani.ac.in",
                "city": "Pilani",
                "state": "Rajasthan",
                "country": "India",
                "is_verified": True,
            }
        )
        self.stdout.write(self.style.SUCCESS("Institutions seeded successfully."))

        # Default Password for all seed accounts
        DEFAULT_PASSWORD = "Password123!"

        # 1. ADMIN USER
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Admin User..."))
        admin_user, created = User.objects.get_or_create(
            email="admin@skillbridge.ai",
            defaults={
                "first_name": "System",
                "last_name": "Admin",
                "role": UserRole.ADMIN,
                "is_active": True,
                "is_staff": True,
                "is_superuser": True,
                "is_verified": True,
            }
        )
        if created:
            admin_user.set_password(DEFAULT_PASSWORD)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("  [+] Admin created: admin@skillbridge.ai"))
        else:
            self.stdout.write(self.style.WARNING("  [-] Admin already exists: admin@skillbridge.ai"))

        # 2. STUDENT USERS
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Student Users..."))
        students_data = [
            {
                "email": "student@skillbridge.ai",
                "first_name": "Ananya",
                "last_name": "Sharma",
                "institution": iitb,
                "enrollment_number": "IITB2023CSE042",
                "course": "B.Tech",
                "specialization": "Computer Science & Engineering",
                "semester": 6,
                "graduation_year": 2027,
                "bio": "Full Stack Developer passionate about Web Development, AI, and Cloud Architecture.",
                "linkedin_url": "https://linkedin.com/in/ananya-sharma",
                "github_url": "https://github.com/ananya-sharma",
            },
            {
                "email": "rahul.verma@college.edu",
                "first_name": "Rahul",
                "last_name": "Verma",
                "institution": dtu,
                "enrollment_number": "DTU2024ECE108",
                "course": "B.Tech",
                "specialization": "Electronics & Communication",
                "semester": 4,
                "graduation_year": 2028,
                "bio": "Electronics enthusiast exploring Embedded Systems, IoT and Data Science.",
                "linkedin_url": "https://linkedin.com/in/rahul-verma",
                "github_url": "https://github.com/rahul-verma",
            },
        ]

        for s_data in students_data:
            user, created = User.objects.get_or_create(
                email=s_data["email"],
                defaults={
                    "first_name": s_data["first_name"],
                    "last_name": s_data["last_name"],
                    "role": UserRole.STUDENT,
                    "is_active": True,
                    "is_verified": True,
                }
            )
            if created:
                user.set_password(DEFAULT_PASSWORD)
                user.save()
            
            profile, _ = StudentProfile.objects.get_or_create(
                user=user,
                defaults={
                    "institution": s_data["institution"],
                    "enrollment_number": s_data["enrollment_number"],
                    "course": s_data["course"],
                    "specialization": s_data["specialization"],
                    "semester": s_data["semester"],
                    "graduation_year": s_data["graduation_year"],
                    "bio": s_data["bio"],
                    "linkedin_url": s_data["linkedin_url"],
                    "github_url": s_data["github_url"],
                }
            )
            status_str = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] Student ({status_str}): {user.email}"))

        # 3. INDUSTRY USERS & COMPANIES
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Industry Users & Companies..."))
        companies_data = [
            {
                "email": "industry@skillbridge.ai",
                "first_name": "Priya",
                "last_name": "Mehta",
                "company_name": "TechNova Solutions",
                "official_email": "contact@technova.com",
                "website": "https://technova.com",
                "industry_type": "Technology / SaaS",
                "company_size": CompanySize.MEDIUM,
                "description": "Leading Cloud & AI Solutions provider building next-generation software products.",
                "is_verified": True,
            },
            {
                "email": "recruiter@nexuscorp.com",
                "first_name": "Vikram",
                "last_name": "Singh",
                "company_name": "Nexus Corp",
                "official_email": "careers@nexuscorp.com",
                "website": "https://nexuscorp.com",
                "industry_type": "Fintech & Finance",
                "company_size": CompanySize.LARGE,
                "description": "Global Financial Technology enterprise empowering digital payment infrastructure.",
                "is_verified": True,
            },
        ]

        for c_data in companies_data:
            user, created = User.objects.get_or_create(
                email=c_data["email"],
                defaults={
                    "first_name": c_data["first_name"],
                    "last_name": c_data["last_name"],
                    "role": UserRole.INDUSTRY,
                    "is_active": True,
                    "is_verified": True,
                }
            )
            if created:
                user.set_password(DEFAULT_PASSWORD)
                user.save()

            company, _ = Company.objects.get_or_create(
                user=user,
                defaults={
                    "company_name": c_data["company_name"],
                    "official_email": c_data["official_email"],
                    "website": c_data["website"],
                    "industry_type": c_data["industry_type"],
                    "company_size": c_data["company_size"],
                    "description": c_data["description"],
                    "is_verified": c_data["is_verified"],
                }
            )
            status_str = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] Industry ({status_str}): {user.email} ({company.company_name})"))

        # 4. ACADEMICIAN USERS & PROFILES
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Academician Users..."))
        academicians_data = [
            {
                "email": "academia@skillbridge.ai",
                "first_name": "Dr. Rajesh",
                "last_name": "Singh",
                "institution": iitb,
                "designation": "Professor & Head of Department",
                "department": "Computer Science & Engineering",
            },
            {
                "email": "faculty@dtu.ac.in",
                "first_name": "Dr. Sunita",
                "last_name": "Kapoor",
                "institution": dtu,
                "designation": "Associate Professor",
                "department": "Information Technology",
            },
        ]

        for a_data in academicians_data:
            user, created = User.objects.get_or_create(
                email=a_data["email"],
                defaults={
                    "first_name": a_data["first_name"],
                    "last_name": a_data["last_name"],
                    "role": UserRole.ACADEMICIAN,
                    "is_active": True,
                    "is_verified": True,
                }
            )
            if created:
                user.set_password(DEFAULT_PASSWORD)
                user.save()

            profile, _ = AcademicianProfile.objects.get_or_create(
                user=user,
                defaults={
                    "institution": a_data["institution"],
                    "designation": a_data["designation"],
                    "department": a_data["department"],
                }
            )
            status_str = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] Academician ({status_str}): {user.email} ({profile.designation})"))

        self.stdout.write(self.style.SUCCESS("\n=================================================="))
        self.stdout.write(self.style.SUCCESS("All User Roles Seeded Successfully!"))
        self.stdout.write(self.style.SUCCESS("Default Password for all accounts: Password123!"))
        self.stdout.write(self.style.SUCCESS("=================================================="))
        self.stdout.write(self.style.SUCCESS("  1. Admin:        admin@skillbridge.ai"))
        self.stdout.write(self.style.SUCCESS("  2. Student:      student@skillbridge.ai"))
        self.stdout.write(self.style.SUCCESS("  3. Industry:     industry@skillbridge.ai"))
        self.stdout.write(self.style.SUCCESS("  4. Academician:  academia@skillbridge.ai"))
        self.stdout.write(self.style.SUCCESS("==================================================\n"))
