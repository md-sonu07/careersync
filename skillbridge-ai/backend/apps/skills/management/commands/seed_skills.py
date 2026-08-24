from django.core.management.base import BaseCommand
from django.db import transaction
from skills.models import Skill, SkillCategory, CareerRole, CareerSkillRequirement


class Command(BaseCommand):
    help = "Seed initial skill intelligence database and career roles"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Skills Library..."))

        skills_data = [
            # Programming
            {"name": "Python", "category": SkillCategory.PROGRAMMING, "description": "High-level programming language widely used in AI, Data Science & Web."},
            {"name": "JavaScript", "category": SkillCategory.PROGRAMMING, "description": "Core language of the web for client-side and server-side applications."},
            {"name": "TypeScript", "category": SkillCategory.PROGRAMMING, "description": "Typed superset of JavaScript that compiles to plain JavaScript."},
            {"name": "Java", "category": SkillCategory.PROGRAMMING, "description": "Object-oriented language for enterprise applications and Android."},
            {"name": "C++", "category": SkillCategory.PROGRAMMING, "description": "General-purpose programming language with performance & memory control."},
            
            # Frontend
            {"name": "React.js", "category": SkillCategory.FRONTEND, "description": "Popular UI component library built by Meta."},
            {"name": "Vue.js", "category": SkillCategory.FRONTEND, "description": "Progressive JavaScript framework for building user interfaces."},
            {"name": "HTML5 & CSS3", "category": SkillCategory.FRONTEND, "description": "Core markup and styling standards for web development."},
            {"name": "Tailwind CSS", "category": SkillCategory.FRONTEND, "description": "Utility-first CSS framework for rapid web styling."},

            # Backend
            {"name": "Django", "category": SkillCategory.BACKEND, "description": "High-level Python web framework for secure, scalable backends."},
            {"name": "Node.js", "category": SkillCategory.BACKEND, "description": "Chrome V8 JavaScript runtime for building backend APIs."},
            {"name": "Express.js", "category": SkillCategory.BACKEND, "description": "Fast, unopinionated web framework for Node.js."},
            {"name": "Spring Boot", "category": SkillCategory.BACKEND, "description": "Java-based framework for enterprise microservices."},

            # Database
            {"name": "PostgreSQL", "category": SkillCategory.DATABASE, "description": "Advanced open-source relational database system."},
            {"name": "MongoDB", "category": SkillCategory.DATABASE, "description": "NoSQL document-based database for flexible schema data."},
            {"name": "Redis", "category": SkillCategory.DATABASE, "description": "In-memory data structure store used as a database and cache."},

            # DevOps & Cloud
            {"name": "Docker", "category": SkillCategory.DEVOPS, "description": "Containerization platform for packaging applications."},
            {"name": "Kubernetes", "category": SkillCategory.DEVOPS, "description": "Container orchestration system for automating deployment."},
            {"name": "AWS", "category": SkillCategory.CLOUD, "description": "Amazon Web Services cloud platform and cloud services."},
            {"name": "Git & GitHub", "category": SkillCategory.DEVOPS, "description": "Version control system and collaborative code hosting platform."},

            # AI/ML
            {"name": "Machine Learning", "category": SkillCategory.AIML, "description": "Supervised and unsupervised learning algorithms and models."},
            {"name": "Deep Learning & PyTorch", "category": SkillCategory.AIML, "description": "Neural network frameworks for AI model training."},
            {"name": "Prompt Engineering", "category": SkillCategory.AIML, "description": "Designing prompts for Large Language Models (LLMs)."},

            # Soft Skills
            {"name": "Problem Solving", "category": SkillCategory.SOFT_SKILL, "description": "Analytical approach to solving complex engineering problems."},
            {"name": "Communication", "category": SkillCategory.SOFT_SKILL, "description": "Verbal and written articulation in team collaboration."},
        ]

        created_skills = {}
        for item in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=item["name"],
                defaults={
                    "category": item["category"],
                    "description": item["description"],
                    "is_active": True,
                }
            )
            created_skills[skill.name] = skill
            status = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] Skill ({status}): {skill.name} [{skill.category}]"))

        self.stdout.write(self.style.MIGRATE_HEADING("\nSeeding Career Roles & Benchmark Requirements..."))

        roles_data = [
            {
                "title": "Full Stack Developer",
                "category": "Web Development",
                "description": "Build end-to-end web applications covering frontend UIs, backend REST APIs, and databases.",
                "requirements": [
                    ("JavaScript", 85, 1.2, True),
                    ("React.js", 80, 1.2, True),
                    ("Node.js", 80, 1.0, True),
                    ("Django", 75, 1.0, False),
                    ("PostgreSQL", 75, 1.0, True),
                    ("Git & GitHub", 80, 0.8, True),
                ]
            },
            {
                "title": "Frontend Developer",
                "category": "Web Development",
                "description": "Specialize in creating responsive, accessible, and high-performance user interfaces.",
                "requirements": [
                    ("JavaScript", 90, 1.3, True),
                    ("TypeScript", 80, 1.1, True),
                    ("React.js", 85, 1.3, True),
                    ("HTML5 & CSS3", 90, 1.0, True),
                    ("Tailwind CSS", 80, 0.8, False),
                ]
            },
            {
                "title": "Backend Developer",
                "category": "Software Engineering",
                "description": "Architect scalable backend services, databases, authentication, and API integrations.",
                "requirements": [
                    ("Python", 85, 1.2, True),
                    ("Django", 85, 1.2, True),
                    ("PostgreSQL", 80, 1.1, True),
                    ("Docker", 75, 0.9, False),
                    ("Git & GitHub", 85, 0.8, True),
                ]
            },
            {
                "title": "AI / ML Engineer",
                "category": "Artificial Intelligence",
                "description": "Train, deploy, and evaluate machine learning models and LLM applications.",
                "requirements": [
                    ("Python", 90, 1.4, True),
                    ("Machine Learning", 85, 1.4, True),
                    ("Deep Learning & PyTorch", 80, 1.2, True),
                    ("Prompt Engineering", 75, 0.9, False),
                ]
            },
            {
                "title": "DevOps Engineer",
                "category": "Cloud & Infrastructure",
                "description": "Automate CI/CD pipelines, cloud infrastructure, container orchestration, and monitoring.",
                "requirements": [
                    ("Docker", 90, 1.3, True),
                    ("Kubernetes", 85, 1.3, True),
                    ("AWS", 80, 1.2, True),
                    ("Git & GitHub", 90, 1.0, True),
                ]
            },
        ]

        for r_data in roles_data:
            role, created = CareerRole.objects.get_or_create(
                title=r_data["title"],
                defaults={
                    "category": r_data["category"],
                    "description": r_data["description"],
                    "is_active": True,
                }
            )
            role_status = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] CareerRole ({role_status}): {role.title}"))

            for req in r_data["requirements"]:
                s_name, min_score, weight, is_req = req
                if s_name in created_skills:
                    CareerSkillRequirement.objects.update_or_create(
                        career_role=role,
                        skill=created_skills[s_name],
                        defaults={
                            "required_score": min_score,
                            "weight": weight,
                            "is_required": is_req,
                        }
                    )

        self.stdout.write(self.style.SUCCESS("\n=================================================="))
        self.stdout.write(self.style.SUCCESS("Skills & Career Roles Seeded Successfully!"))
        self.stdout.write(self.style.SUCCESS("==================================================\n"))
