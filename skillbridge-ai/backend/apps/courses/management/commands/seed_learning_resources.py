from django.core.management.base import BaseCommand
from django.db import transaction
from skills.models import Skill
from assessments.models import DifficultyLevel
from courses.models import LearningResource, ResourceType


class Command(BaseCommand):
    help = "Seed initial learning resources for CareerSync"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Learning Resources..."))

        resources_data = [
            {
                "skill_name": "Docker",
                "title": "Docker & DevOps Essentials",
                "description": "Master containers, Dockerfiles, volumes, docker-compose, and deployment pipelines.",
                "level": DifficultyLevel.BEGINNER,
                "resource_type": ResourceType.COURSE,
                "content_url": "https://careersync.ai/courses/docker-essentials",
                "duration_minutes": 645,
            },
            {
                "skill_name": "Testing",
                "title": "Testing with Jest, React Testing Library & Pytest",
                "description": "Fill your testing gap — unit testing, integration tests, and TDD patterns.",
                "level": DifficultyLevel.INTERMEDIATE,
                "resource_type": ResourceType.COURSE,
                "content_url": "https://careersync.ai/courses/testing-mastery",
                "duration_minutes": 500,
            },
            {
                "skill_name": "Python",
                "title": "Python Advanced Functional & OOP Patterns",
                "description": "Deep dive into decorators, generators, metaclasses, and asynchronous Python.",
                "level": DifficultyLevel.ADVANCED,
                "resource_type": ResourceType.COURSE,
                "content_url": "https://careersync.ai/courses/python-advanced",
                "duration_minutes": 420,
            },
            {
                "skill_name": "React.js",
                "title": "React 19 Hooks & State Management Deep Dive",
                "description": "Learn custom hooks, Redux Toolkit, React Query, and performance optimization.",
                "level": DifficultyLevel.INTERMEDIATE,
                "resource_type": ResourceType.COURSE,
                "content_url": "https://careersync.ai/courses/react-mastery",
                "duration_minutes": 580,
            },
            {
                "skill_name": "Django",
                "title": "Building Production REST APIs with Django & DRF",
                "description": "Comprehensive guide to serializers, viewsets, authentication, rate limiting, and JWT.",
                "level": DifficultyLevel.INTERMEDIATE,
                "resource_type": ResourceType.COURSE,
                "content_url": "https://careersync.ai/courses/django-rest",
                "duration_minutes": 600,
            },
            {
                "skill_name": "PostgreSQL",
                "title": "PostgreSQL Database Indexing & Query Tuning",
                "description": "Master indexing strategies, EXPLAIN ANALYZE, database normalization, and query optimization.",
                "level": DifficultyLevel.INTERMEDIATE,
                "resource_type": ResourceType.ARTICLE,
                "content_url": "https://careersync.ai/resources/postgres-tuning",
                "duration_minutes": 90,
            },
            {
                "skill_name": "System Design",
                "title": "Full Stack Capstone Project: Real-time Analytics System",
                "description": "Build an end-to-end full stack application with caching, queues, and containerization.",
                "level": DifficultyLevel.ADVANCED,
                "resource_type": ResourceType.PROJECT,
                "content_url": "https://careersync.ai/projects/analytics-capstone",
                "duration_minutes": 1200,
            },
        ]

        for r_data in resources_data:
            try:
                skill = Skill.objects.get(name=r_data["skill_name"])
            except Skill.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Skill '{r_data['skill_name']}' not found. Skipping resource."))
                continue

            resource, created = LearningResource.objects.get_or_create(
                title=r_data["title"],
                defaults={
                    "description": r_data["description"],
                    "skill": skill,
                    "level": r_data["level"],
                    "resource_type": r_data["resource_type"],
                    "content_url": r_data["content_url"],
                    "duration_minutes": r_data["duration_minutes"],
                    "is_active": True,
                }
            )

            status = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] LearningResource ({status}): {resource.title} [{skill.name}]"))

        self.stdout.write(self.style.SUCCESS("\n=================================================="))
        self.stdout.write(self.style.SUCCESS("Learning Resources Seeded Successfully!"))
        self.stdout.write(self.style.SUCCESS("==================================================\n"))
