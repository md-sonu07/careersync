from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from courses.models import LearningResource
from institutions.models import Institution

class Command(BaseCommand):
    help = "Set real fees and pricing on all courses in CareerSync"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Setting real fees on all courses..."))

        aku_inst = Institution.objects.filter(name__icontains="Aryabhatta").first()
        if not aku_inst:
            aku_inst = Institution.objects.first()

        PRICING_CATALOG = {
            "Data Structures & Algorithms in Java for Campus Placements": (499.00, 2499.00, "Prof. S. N. Prasad (AKU T&P)"),
            "Modern React 19 & Next.js Full Stack Architecture": (599.00, 1999.00, "Dr. Rajesh Kumar (AKU CSE)"),
            "Full Stack Web Development with React & Node.js": (699.00, 2499.00, "Dr. Rajesh Kumar (AKU Dept of CSE)"),
            "Python & Django Scalable Backend Engineering": (499.00, 1999.00, "Prof. A. K. Sinha (AKU IT Dept)"),
            "Cloud Computing, Docker & Kubernetes Deployment": (699.00, 2499.00, "Prof. Vikramaditya (AKU Cloud Lab)"),
            "Applied Machine Learning & Data Science with PyTorch": (799.00, 3499.00, "Dr. Meenakshi Roy (AI Lab AKU)"),
            "PostgreSQL Database Indexing & Query Tuning": (399.00, 1499.00, "Prof. Alok Verma (AKU DB Lab)"),
            "Building Production REST APIs with Django & DRF": (499.00, 1899.00, "Prof. A. K. Sinha (AKU IT Dept)"),
            "React 19 Hooks & State Management Deep Dive": (449.00, 1699.00, "Dr. Rajesh Kumar (AKU Dept of CSE)"),
            "Python Advanced Functional & OOP Patterns": (499.00, 1799.00, "Prof. Sunita Kumari (AKU IT)"),
            "Docker & DevOps Essentials": (599.00, 2299.00, "Prof. Vikramaditya (AKU Cloud Lab)"),
            "Testing with Jest, React Testing Library & Pytest": (399.00, 1499.00, "QA Specialist Faculty (AKU)"),
            "Full Stack Capstone Project: Real-time Analytics System": (899.00, 3999.00, "Senior Technical Architect (AKU)"),
        }

        updated_count = 0
        all_courses = LearningResource.objects.all()

        for course in all_courses:
            title_key = course.title.strip()
            
            # Find closest match or generate tiered fee
            matched = None
            for key, val in PRICING_CATALOG.items():
                if key.lower() in title_key.lower() or title_key.lower() in key.lower():
                    matched = val
                    break

            if matched:
                selling_price, orig_price, instructor = matched
            else:
                # Tiered fee based on difficulty
                if course.level == 'advanced':
                    selling_price, orig_price = 799.00, 2999.00
                elif course.level == 'intermediate':
                    selling_price, orig_price = 499.00, 1999.00
                else:
                    selling_price, orig_price = 399.00, 1499.00
                instructor = course.instructor_name or "Faculty Expert (AKU)"

            course.price = Decimal(str(selling_price))
            course.original_price = Decimal(str(orig_price))
            course.is_free = False
            course.certificate_included = True
            if not course.institution and aku_inst:
                course.institution = aku_inst
            if not course.instructor_name or course.instructor_name == "Academic Institution":
                course.instructor_name = instructor

            # Ensure default curriculum if missing
            if not course.curriculum or len(course.curriculum) == 0:
                course.curriculum = [
                    {
                        "title": "Module 1: Foundations & Architecture",
                        "duration": "1 hr 30 mins",
                        "lessons": [
                            {"id": f"{course.id}-l1", "title": f"Introduction to {course.title}", "duration": "25:00", "video_url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "is_preview": True},
                            {"id": f"{course.id}-l2", "title": "Core Concepts & Setup", "duration": "35:00", "video_url": "https://www.youtube.com/watch?v=w7ejDZ8SWv8", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 2: Advanced Topics & Hands-on Implementation",
                        "duration": "2 hrs 00 mins",
                        "lessons": [
                            {"id": f"{course.id}-l3", "title": "Real-world Project & Deployment", "duration": "45:00", "video_url": "https://www.youtube.com/watch?v=rgWSm8aDcfU", "is_preview": False}
                        ]
                    }
                ]

            if not course.what_you_will_learn or len(course.what_you_will_learn) == 0:
                course.what_you_will_learn = [
                    f"Comprehensive mastery of {course.skill.name if course.skill else 'Core Engineering'}",
                    "Industry-standard coding patterns and real-world project workflows",
                    "Hands-on placement problem solving and interview preparation",
                    "Verified certificate upon 100% curriculum completion"
                ]

            course.save()
            updated_count += 1
            self.stdout.write(self.style.SUCCESS(f"  [+] Set Fees on '{course.title}': Rs.{course.price} (Orig: Rs.{course.original_price})"))

        self.stdout.write(self.style.SUCCESS(f"Successfully updated all {updated_count} courses with real fees and pricing!"))
