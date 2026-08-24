from django.core.management.base import BaseCommand
from django.db import transaction
from skills.models import Skill
from assessments.models import Assessment, Question, QuestionOption, DifficultyLevel


class Command(BaseCommand):
    help = "Seed initial skill assessments and question banks for CareerSync"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Assessments & Question Banks..."))

        assessments_data = [
            {
                "skill_name": "Python",
                "title": "Python Core & Functional Programming",
                "description": "Evaluate core Python syntax, data structures, list comprehensions, decorators, and OOP concepts.",
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "time_limit": 15,
                "total_marks": 100,
                "questions": [
                    {
                        "text": "What is the result of applying list comprehension `[x**2 for x in range(5) if x % 2 == 0]`?",
                        "difficulty": DifficultyLevel.BEGINNER,
                        "explanation": "range(5) gives 0..4. Even numbers are 0, 2, 4. Squares are 0, 4, 16.",
                        "options": [
                            ("[0, 4, 16]", True),
                            ("[1, 9, 25]", False),
                            ("[0, 1, 4, 9, 16]", False),
                            ("[4, 16]", False),
                        ]
                    },
                    {
                        "text": "Which built-in Python function is used to return an iterator of tuples where the i-th tuple contains the i-th element from each of the argument sequences?",
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "explanation": "zip(*iterables) aggregates elements from each of the iterables.",
                        "options": [
                            ("zip()", True),
                            ("map()", False),
                            ("filter()", False),
                            ("enumerate()", False),
                        ]
                    },
                    {
                        "text": "What is the main benefit of using a Python Generator over a standard list?",
                        "difficulty": DifficultyLevel.ADVANCED,
                        "explanation": "Generators compute items on-the-fly (lazy evaluation), saving memory for large datasets.",
                        "options": [
                            ("Lazy evaluation saving memory", True),
                            ("Faster indexing performance", False),
                            ("Immutability of data elements", False),
                            ("Automatic multi-threading support", False),
                        ]
                    },
                ]
            },
            {
                "skill_name": "React.js",
                "title": "React 19 & Component Architecture",
                "description": "Test knowledge of React hooks, component lifecycle, state management, and JSX patterns.",
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "time_limit": 15,
                "total_marks": 100,
                "questions": [
                    {
                        "text": "Which React hook is recommended for managing complex local component state with action dispatches?",
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "explanation": "useReducer is ideal for complex state logic involving multiple sub-values.",
                        "options": [
                            ("useReducer", True),
                            ("useState", False),
                            ("useRef", False),
                            ("useCallback", False),
                        ]
                    },
                    {
                        "text": "Why should you pass a callback function to `setCount(prev => prev + 1)` instead of `setCount(count + 1)`?",
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "explanation": "Passing a updater function ensures state updates rely on the latest pending state value during batched renders.",
                        "options": [
                            ("Ensures updates rely on the latest pending state during batched renders", True),
                            ("Prevents component re-renders", False),
                            ("Synchronously mutates the virtual DOM", False),
                            ("Required for TypeScript type inference", False),
                        ]
                    },
                    {
                        "text": "What is the primary use case of `useMemo` in React?",
                        "difficulty": DifficultyLevel.ADVANCED,
                        "explanation": "useMemo caches the result of an expensive calculation between re-renders.",
                        "options": [
                            ("Memoizing expensive calculation results", True),
                            ("Storing persistent DOM node references", False),
                            ("Handling asynchronous API requests", False),
                            ("Replacing Redux global state store", False),
                        ]
                    },
                ]
            },
            {
                "skill_name": "Django",
                "title": "Django Web Framework & ORM",
                "description": "Assess proficiency in Django REST Framework, ORM queries, middleware, authentication, and migrations.",
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "time_limit": 20,
                "total_marks": 100,
                "questions": [
                    {
                        "text": "Which Django ORM method is used to solve the N+1 queries problem for ForeignKeys?",
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "explanation": "select_related performs an SQL JOIN to fetch related objects in a single query.",
                        "options": [
                            ("select_related()", True),
                            ("prefetch_related()", False),
                            ("filter()", False),
                            ("aggregate()", False),
                        ]
                    },
                    {
                        "text": "In Django SimpleJWT, what is the purpose of token blacklisting upon logout?",
                        "difficulty": DifficultyLevel.ADVANCED,
                        "explanation": "Blacklisting invalidates refresh tokens so they can no longer generate new access tokens.",
                        "options": [
                            ("Invalidating refresh tokens to prevent issuing new access tokens", True),
                            ("Encrypting user passwords in database", False),
                            ("Clearing browser cookie cache automatically", False),
                            ("Bypassing CORS preflight checks", False),
                        ]
                    },
                ]
            },
            {
                "skill_name": "Docker",
                "title": "Docker Containerization & Infrastructure",
                "description": "Evaluate containers, Dockerfiles, multi-stage builds, volumes, and docker-compose configurations.",
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "time_limit": 15,
                "total_marks": 100,
                "questions": [
                    {
                        "text": "What is the primary purpose of multi-stage builds in a Dockerfile?",
                        "difficulty": DifficultyLevel.ADVANCED,
                        "explanation": "Multi-stage builds allow creating lean final production images by excluding build tools.",
                        "options": [
                            ("Creating lean production images without build dependencies", True),
                            ("Running containers in parallel during build", False),
                            ("Enabling automatic image encryption", False),
                            ("Bypassing Docker daemon socket", False),
                        ]
                    },
                    {
                        "text": "Which Docker command creates and starts containers defined in a `docker-compose.yml` file in the background?",
                        "difficulty": DifficultyLevel.BEGINNER,
                        "explanation": "docker-compose up -d builds, creates, starts, and detaches containers in the background.",
                        "options": [
                            ("docker-compose up -d", True),
                            ("docker run --detach", False),
                            ("docker-compose build", False),
                            ("docker start --all", False),
                        ]
                    },
                ]
            },
        ]

        for a_data in assessments_data:
            try:
                skill = Skill.objects.get(name=a_data["skill_name"])
            except Skill.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Skill '{a_data['skill_name']}' not found. Skipping assessment."))
                continue

            assessment, created = Assessment.objects.get_or_create(
                title=a_data["title"],
                defaults={
                    "description": a_data["description"],
                    "skill": skill,
                    "difficulty": a_data["difficulty"],
                    "time_limit": a_data["time_limit"],
                    "total_marks": a_data["total_marks"],
                    "is_active": True,
                }
            )

            status = "created" if created else "exists"
            self.stdout.write(self.style.SUCCESS(f"  [+] Assessment ({status}): {assessment.title} [{skill.name}]"))

            for q_item in a_data["questions"]:
                question, q_created = Question.objects.get_or_create(
                    assessment=assessment,
                    question_text=q_item["text"],
                    defaults={
                        "skill": skill,
                        "difficulty": q_item["difficulty"],
                        "explanation": q_item["explanation"],
                        "is_ai_generated": False,
                    }
                )

                if q_created:
                    for opt_text, is_corr in q_item["options"]:
                        QuestionOption.objects.create(
                            question=question,
                            option_text=opt_text,
                            is_correct=is_corr
                        )

        self.stdout.write(self.style.SUCCESS("\n=================================================="))
        self.stdout.write(self.style.SUCCESS("Assessments & Question Banks Seeded Successfully!"))
        self.stdout.write(self.style.SUCCESS("==================================================\n"))
