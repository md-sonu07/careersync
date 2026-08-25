from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

from accounts.models import UserRole
from institutions.models import Institution
from academicians.models import AcademicianProfile
from students.models import StudentProfile
from skills.models import Skill, StudentSkill, SkillSource, CareerRole, CareerSkillRequirement
from skills.services.gap_engine import calculate_student_skill_gaps
from courses.models import LearningResource, DifficultyLevel, ResourceType

User = get_user_model()


class Command(BaseCommand):
    help = "Seed 10 AKU Students with skill scores and gaps, plus 5 AKU Courses"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding AKU Institution, 10 Students with Skill Gaps, and 5 Courses..."))

        # 1. Ensure AKU Institution exists & is linked to AKU user
        aku_user = User.objects.filter(email='aku@gmail.com').first()
        if not aku_user:
            aku_user = User.objects.create_user(
                email='aku@gmail.com',
                password='Password@123',
                first_name='Aryabhatta Knowledge University',
                last_name='',
                role=UserRole.ACADEMICIAN,
                is_verified=True,
            )

        aku_inst, _ = Institution.objects.get_or_create(
            name="Aryabhatta Knowledge University (AKU)",
            defaults={
                "website": "https://aku.ac.in",
                "city": "Patna",
                "state": "Bihar",
                "country": "India",
                "is_verified": True,
            }
        )
        aku_inst.is_verified = True
        aku_inst.save()

        acad_profile, _ = AcademicianProfile.objects.get_or_create(user=aku_user)
        acad_profile.institution = aku_inst
        acad_profile.department = "Department of Computer Science & IT"
        acad_profile.designation = "Training & Placement Officer"
        acad_profile.save()

        self.stdout.write(self.style.SUCCESS(f"Verified AKU Institution: {aku_inst.name}"))

        # 2. Ensure standard Skills & Career Roles exist
        skills_def = [
            ("React", "Frontend"),
            ("Python", "Programming"),
            ("Django", "Backend"),
            ("Node.js", "Backend"),
            ("SQL", "Database"),
            ("Docker", "DevOps"),
            ("AWS / Cloud", "Cloud"),
            ("Machine Learning", "AI/ML"),
            ("Data Structures & Algorithms", "Programming"),
            ("TypeScript", "Frontend"),
        ]

        skill_objs = {}
        for name, cat in skills_def:
            s_obj, _ = Skill.objects.get_or_create(name=name, defaults={"category": cat})
            skill_objs[name] = s_obj

        fullstack_role, _ = CareerRole.objects.get_or_create(
            title="Full Stack Software Engineer",
            defaults={"category": "Engineering", "description": "Builds scalable end-to-end web applications."}
        )

        role_reqs = [
            ("React", 75),
            ("Python", 70),
            ("Django", 70),
            ("SQL", 65),
            ("Docker", 60),
            ("AWS / Cloud", 65),
            ("Data Structures & Algorithms", 80),
        ]
        for s_name, req_score in role_reqs:
            CareerSkillRequirement.objects.get_or_create(
                career_role=fullstack_role,
                skill=skill_objs[s_name],
                defaults={"required_score": req_score, "is_required": True}
            )

        # 3. Create 10 Students for AKU
        students_data = [
            ("Aman Kumar", "aman.aku@gmail.com", "B.Tech Computer Science", "Full Stack Development", 2026, 6, "AKU2023CS001", [("React", 82), ("Python", 68), ("SQL", 75), ("Docker", 45), ("AWS / Cloud", 50), ("Data Structures & Algorithms", 78)]),
            ("Priya Sharma", "priya.aku@gmail.com", "B.Tech Computer Science", "AI & Machine Learning", 2026, 6, "AKU2023CS002", [("Python", 88), ("Machine Learning", 84), ("SQL", 70), ("React", 55), ("Docker", 40), ("Data Structures & Algorithms", 72)]),
            ("Rahul Singh", "rahulsingh.aku@gmail.com", "B.Tech Information Technology", "Backend Engineering", 2025, 8, "AKU2022IT014", [("Python", 78), ("Django", 80), ("SQL", 82), ("Docker", 65), ("AWS / Cloud", 58), ("React", 48)]),
            ("Ananya Mishra", "ananya.aku@gmail.com", "B.Tech Computer Science", "Frontend Engineering", 2027, 4, "AKU2024CS033", [("React", 76), ("TypeScript", 70), ("Node.js", 60), ("SQL", 52), ("Data Structures & Algorithms", 64)]),
            ("Rohit Verma", "rohit.aku@gmail.com", "B.Tech Computer Science", "Cloud & DevOps", 2025, 8, "AKU2022CS089", [("Docker", 78), ("AWS / Cloud", 82), ("Python", 72), ("SQL", 68), ("React", 42), ("Data Structures & Algorithms", 65)]),
            ("Sneha Gupta", "sneha.aku@gmail.com", "B.Tech Data Science", "Data Engineering", 2026, 6, "AKU2023DS008", [("Python", 85), ("SQL", 88), ("Machine Learning", 74), ("AWS / Cloud", 60), ("Docker", 50)]),
            ("Aditya Raj", "aditya.aku@gmail.com", "B.Tech Computer Science", "Full Stack Development", 2026, 6, "AKU2023CS045", [("React", 65), ("Django", 68), ("SQL", 60), ("Python", 62), ("Docker", 38), ("AWS / Cloud", 42)]),
            ("Riya Kumari", "riya.aku@gmail.com", "B.Tech Information Technology", "Web Technologies", 2027, 4, "AKU2024IT021", [("React", 70), ("Node.js", 64), ("SQL", 58), ("Python", 50), ("Data Structures & Algorithms", 55)]),
            ("Vikash Yadav", "vikash.aku@gmail.com", "B.Tech Computer Science", "Competitive Programming", 2025, 8, "AKU2022CS012", [("Data Structures & Algorithms", 92), ("Python", 76), ("SQL", 70), ("Docker", 42), ("AWS / Cloud", 40)]),
            ("Neha Patel", "neha.aku@gmail.com", "B.Tech AI & Data Science", "Applied AI", 2026, 6, "AKU2023AI005", [("Python", 82), ("Machine Learning", 78), ("SQL", 68), ("React", 50), ("Docker", 48)]),
        ]

        created_students = []
        for full_name, email, course, spec, grad_yr, sem, enroll_no, student_skills in students_data:
            first_name = full_name.split()[0]
            last_name = " ".join(full_name.split()[1:])
            u, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "role": UserRole.STUDENT,
                    "is_verified": True,
                }
            )
            u.set_password("Password@123")
            u.is_verified = True
            u.save()

            st_prof, _ = StudentProfile.objects.get_or_create(
                user=u,
                defaults={
                    "institution": aku_inst,
                    "career_goal": "Full Stack Software Engineer",
                    "course": course,
                    "specialization": spec,
                    "graduation_year": grad_yr,
                    "semester": sem,
                    "enrollment_number": enroll_no,
                    "bio": f"{spec} student at AKU passionate about software development and problem solving.",
                }
            )
            st_prof.institution = aku_inst
            st_prof.career_goal = "Full Stack Software Engineer"
            st_prof.save()

            # Assign Skills
            for sk_name, sk_score in student_skills:
                ss, _ = StudentSkill.objects.get_or_create(
                    student=st_prof,
                    skill=skill_objs[sk_name],
                    defaults={
                        "score": sk_score,
                        "source": SkillSource.ASSESSMENT,
                        "is_verified": True
                    }
                )
                ss.score = sk_score
                ss.save()

            # Calculate Skill Gaps for Student
            calculate_student_skill_gaps(st_prof, career_role=fullstack_role)
            created_students.append(st_prof)

        self.stdout.write(self.style.SUCCESS(f"Successfully created & linked {len(created_students)} AKU students with live skill gaps!"))

        # 4. Create 5 Courses offered by AKU
        courses_data = [
            {
                "title": "Full Stack Web Development with React & Node.js",
                "description": "Comprehensive institutional curriculum covering React 18, State Management, REST APIs with Node/Express, and MongoDB architecture.",
                "skill": skill_objs["React"],
                "level": DifficultyLevel.INTERMEDIATE,
                "resource_type": ResourceType.COURSE,
                "duration_minutes": 360,
                "instructor_name": "Dr. Rajesh Kumar (AKU Dept of CSE)",
                "thumbnail_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
                "rating": 4.9,
                "enrolled_count": 142,
                "price": 0.00,
                "original_price": 1499.00,
                "is_free": True,
                "content_url": "https://www.youtube.com/watch?v=bMknfKXIFA8",
                "what_you_will_learn": [
                    "React 19 Hooks, Custom Hooks, and Functional Component Architecture",
                    "Global state management using Zustand and Context API",
                    "Building high-performance Full Stack apps with Next.js App Router",
                    "REST API integrations with Axios, React Query, and JWT Auth",
                    "Production deployment on Vercel and performance optimization"
                ],
                "curriculum": [
                    {
                        "title": "Module 1: React Fundamentals & Component Design",
                        "duration": "1 hr 15 mins",
                        "lessons": [
                            {"id": "react-l1", "title": "Introduction to Modern React & Ecosystem", "duration": "18:30", "video_url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "is_preview": True},
                            {"id": "react-l2", "title": "JSX, Props, and State Management", "duration": "24:10", "video_url": "https://www.youtube.com/watch?v=w7ejDZ8SWv8", "is_preview": False},
                            {"id": "react-l3", "title": "Hooks Deep Dive: useState, useEffect & useRef", "duration": "32:20", "video_url": "https://www.youtube.com/watch?v=O6P86uwfdR0", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 2: Advanced State & API Integration",
                        "duration": "1 hr 45 mins",
                        "lessons": [
                            {"id": "react-l4", "title": "Handling Forms, Validation & Tailwind CSS", "duration": "28:15", "video_url": "https://www.youtube.com/watch?v=SqcY0GlETPk", "is_preview": False},
                            {"id": "react-l5", "title": "Connecting to Backend REST APIs & JWT Auth", "duration": "38:40", "video_url": "https://www.youtube.com/watch?v=rgWSm8aDcfU", "is_preview": False},
                            {"id": "react-l6", "title": "Zustand & Global Store Management", "duration": "35:00", "video_url": "https://www.youtube.com/watch?v=KCr-UNs1gYA", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 3: Capstone Full Stack Project & Deployment",
                        "duration": "2 hrs 00 mins",
                        "lessons": [
                            {"id": "react-l7", "title": "Building the Complete Career Portal Dashboard", "duration": "55:00", "video_url": "https://www.youtube.com/watch?v=843nec-IvW0", "is_preview": False},
                            {"id": "react-l8", "title": "CI/CD Pipeline & Production Deployment", "duration": "32:00", "video_url": "https://www.youtube.com/watch?v=1w0_kF63_Yg", "is_preview": False}
                        ]
                    }
                ],
                "faqs": [
                    {"q": "Is this course free for AKU students?", "a": "Yes, 100% free sponsorship is provided for all enrolled students across Bihar universities."},
                    {"q": "Will I get a verified certificate?", "a": "Yes! Completing all modules unlocks an official AKU + CareerSync Verified Certificate with unique QR code verification."}
                ]
            },
            {
                "title": "Python & Django Scalable Backend Engineering",
                "description": "Master clean Python, Django ORM, authentication systems, PostgreSQL integration, and building high-performance REST APIs.",
                "skill": skill_objs["Python"],
                "level": DifficultyLevel.INTERMEDIATE,
                "resource_type": ResourceType.COURSE,
                "duration_minutes": 300,
                "instructor_name": "Prof. A. K. Sinha (AKU IT Dept)",
                "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                "rating": 4.8,
                "enrolled_count": 98,
                "price": 499.00,
                "original_price": 1999.00,
                "is_free": False,
                "content_url": "https://www.youtube.com/watch?v=F5mRW0jo-U4",
                "what_you_will_learn": [
                    "Object Oriented Python, Generators, and Decorators",
                    "Django Architecture: Models, Views, Templates, and Middleware",
                    "Django REST Framework (DRF) Serializers and ViewSets",
                    "Database Optimization, Indexing, and PostgreSQL Queries",
                    "Celery, Redis Background Workers & Caching"
                ],
                "curriculum": [
                    {
                        "title": "Module 1: Advanced Python & Architecture",
                        "duration": "1 hr 10 mins",
                        "lessons": [
                            {"id": "py-l1", "title": "Python 3 OOPs & Modern Best Practices", "duration": "25:00", "video_url": "https://www.youtube.com/watch?v=rfscVS0vtbw", "is_preview": True},
                            {"id": "py-l2", "title": "Decorators, Context Managers & Generators", "duration": "30:00", "video_url": "https://www.youtube.com/watch?v=FsAPt_9Bf3U", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 2: Django & Django REST Framework",
                        "duration": "2 hrs 15 mins",
                        "lessons": [
                            {"id": "py-l3", "title": "Django Models, Migrations & Complex ORM Queries", "duration": "45:00", "video_url": "https://www.youtube.com/watch?v=F5mRW0jo-U4", "is_preview": False},
                            {"id": "py-l4", "title": "Building Production REST APIs with DRF & JWT", "duration": "50:00", "video_url": "https://www.youtube.com/watch?v=c708Nf0cHrs", "is_preview": False}
                        ]
                    }
                ],
                "faqs": [
                    {"q": "Are real industry projects included?", "a": "Yes, you will build an end-to-end Hiring Portal backend with PostgreSQL and DRF."}
                ]
            },
            {
                "title": "Cloud Computing, Docker & Kubernetes Deployment",
                "description": "Containerize microservices, write Dockerfiles, configure multi-container docker-compose, and deploy apps onto AWS Cloud.",
                "skill": skill_objs["AWS / Cloud"],
                "level": DifficultyLevel.ADVANCED,
                "resource_type": ResourceType.COURSE,
                "duration_minutes": 240,
                "instructor_name": "Prof. Vikramaditya (AKU)",
                "thumbnail_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                "rating": 4.7,
                "enrolled_count": 86,
                "price": 699.00,
                "original_price": 2499.00,
                "is_free": False,
                "content_url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
                "what_you_will_learn": [
                    "Docker Containers, Dockerfiles, and Multi-stage builds",
                    "Multi-container setups with Docker Compose and Networks",
                    "Kubernetes Pods, Deployments, and Services",
                    "AWS EC2, S3, RDS, and CloudWatch Monitoring"
                ],
                "curriculum": [
                    {
                        "title": "Module 1: Docker Containerization",
                        "duration": "1 hr 20 mins",
                        "lessons": [
                            {"id": "cloud-l1", "title": "Docker Fundamentals & Container Lifecycle", "duration": "35:00", "video_url": "https://www.youtube.com/watch?v=fqMOX6JJhGo", "is_preview": True},
                            {"id": "cloud-l2", "title": "Docker Compose & Multi-Service Stacks", "duration": "45:00", "video_url": "https://www.youtube.com/watch?v=HG6yLvPUbdA", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 2: Kubernetes & Cloud Deployment",
                        "duration": "1 hr 40 mins",
                        "lessons": [
                            {"id": "cloud-l3", "title": "Kubernetes Architecture & Cluster Setup", "duration": "40:00", "video_url": "https://www.youtube.com/watch?v=X48VuDVv0do", "is_preview": False},
                            {"id": "cloud-l4", "title": "Deploying Full Stack Web Apps to AWS", "duration": "45:00", "video_url": "https://www.youtube.com/watch?v=r4YIdn2eTm4", "is_preview": False}
                        ]
                    }
                ],
                "faqs": [
                    {"q": "Do I need an AWS Account?", "a": "A free-tier AWS account is sufficient for all hands-on labs in this course."}
                ]
            },
            {
                "title": "Data Structures & Algorithms in Java for Campus Placements",
                "description": "In-depth problem solving on Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and top product company coding patterns.",
                "skill": skill_objs["Data Structures & Algorithms"],
                "level": DifficultyLevel.BEGINNER,
                "resource_type": ResourceType.COURSE,
                "duration_minutes": 480,
                "instructor_name": "Prof. S. N. Prasad (AKU T&P)",
                "thumbnail_url": "https://images.unsplash.com/photo-1516116211227-bbc1b835e076?w=600&auto=format&fit=crop&q=80",
                "rating": 4.9,
                "enrolled_count": 210,
                "price": 0.00,
                "original_price": 2999.00,
                "is_free": True,
                "content_url": "https://www.youtube.com/watch?v=rZ41y93P2Qo",
                "what_you_will_learn": [
                    "Time and Space Complexity Analysis (Big O Notation)",
                    "Arrays, Two Pointers, Sliding Window, and Binary Search",
                    "Recursion, Backtracking, and Dynamic Programming",
                    "Trees, Binary Search Trees, Heaps, and Tries",
                    "Graph Traversals (BFS, DFS, Dijkstra) and Top Placement Questions"
                ],
                "curriculum": [
                    {
                        "title": "Module 1: Foundations & Arrays",
                        "duration": "2 hrs 00 mins",
                        "lessons": [
                            {"id": "dsa-l1", "title": "Big-O Notation & Complexity Analysis", "duration": "30:00", "video_url": "https://www.youtube.com/watch?v=FPu9Uld7W-E", "is_preview": True},
                            {"id": "dsa-l2", "title": "Array Techniques: Two Pointers & Sliding Window", "duration": "45:00", "video_url": "https://www.youtube.com/watch?v=rZ41y93P2Qo", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 2: Non-Linear Data Structures & DP",
                        "duration": "2 hrs 30 mins",
                        "lessons": [
                            {"id": "dsa-l3", "title": "Binary Trees & BST Traversals", "duration": "50:00", "video_url": "https://www.youtube.com/watch?v=-DzowlcaUmE", "is_preview": False},
                            {"id": "dsa-l4", "title": "Dynamic Programming Masterclass", "duration": "60:00", "video_url": "https://www.youtube.com/watch?v=oBt53YbR9Kk", "is_preview": False}
                        ]
                    }
                ],
                "faqs": [
                    {"q": "Is this geared towards placements?", "a": "Yes! Specifically curated for TCS, Infosys, Wipro, Amazon, and product companies."}
                ]
            },
            {
                "title": "Applied Machine Learning & Data Science with PyTorch",
                "description": "From data preprocessing with Pandas/NumPy to training deep neural networks and deploying predictive ML models.",
                "skill": skill_objs["Machine Learning"],
                "level": DifficultyLevel.ADVANCED,
                "resource_type": ResourceType.COURSE,
                "duration_minutes": 420,
                "instructor_name": "Dr. Meenakshi Roy (AI Lab AKU)",
                "thumbnail_url": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
                "rating": 4.9,
                "enrolled_count": 115,
                "price": 799.00,
                "original_price": 3499.00,
                "is_free": False,
                "content_url": "https://www.youtube.com/watch?v=V_xro1bcAuA",
                "what_you_will_learn": [
                    "Data Exploration, Feature Engineering with Pandas & NumPy",
                    "Supervised & Unsupervised Machine Learning Algorithms",
                    "Deep Learning with PyTorch: Tensors, Autograd & Neural Networks",
                    "Computer Vision and NLP introductory models"
                ],
                "curriculum": [
                    {
                        "title": "Module 1: Data Science Foundations",
                        "duration": "1 hr 30 mins",
                        "lessons": [
                            {"id": "ml-l1", "title": "Python for Data Science: NumPy & Pandas", "duration": "40:00", "video_url": "https://www.youtube.com/watch?v=LHBE6Q9XlzI", "is_preview": True},
                            {"id": "ml-l2", "title": "Exploratory Data Analysis & Visualization", "duration": "40:00", "video_url": "https://www.youtube.com/watch?v=r-uOLxNrNk8", "is_preview": False}
                        ]
                    },
                    {
                        "title": "Module 2: PyTorch & Deep Neural Networks",
                        "duration": "2 hrs 00 mins",
                        "lessons": [
                            {"id": "ml-l3", "title": "PyTorch Crash Course: Tensors to Training", "duration": "55:00", "video_url": "https://www.youtube.com/watch?v=V_xro1bcAuA", "is_preview": False},
                            {"id": "ml-l4", "title": "Building & Deploying your first Image Classifier", "duration": "50:00", "video_url": "https://www.youtube.com/watch?v=tPYj3fFJGjk", "is_preview": False}
                        ]
                    }
                ],
                "faqs": [
                    {"q": "Can I run code on Google Colab?", "a": "Yes! All notebook exercises run 100% on free Google Colab GPU runtimes."}
                ]
            }
        ]

        created_courses = []
        for c in courses_data:
            course_obj, _ = LearningResource.objects.update_or_create(
                title=c["title"],
                defaults={
                    "institution": aku_inst,
                    "description": c["description"],
                    "skill": c["skill"],
                    "level": c["level"],
                    "resource_type": c["resource_type"],
                    "duration_minutes": c["duration_minutes"],
                    "instructor_name": c["instructor_name"],
                    "thumbnail_url": c["thumbnail_url"],
                    "rating": c["rating"],
                    "enrolled_count": c["enrolled_count"],
                    "content_url": c["content_url"],
                    "price": c["price"],
                    "original_price": c["original_price"],
                    "is_free": c["is_free"],
                    "certificate_included": True,
                    "what_you_will_learn": c["what_you_will_learn"],
                    "curriculum": c["curriculum"],
                    "faqs": c["faqs"],
                    "is_active": True,
                }
            )
            created_courses.append(course_obj)

        self.stdout.write(self.style.SUCCESS(f"Successfully created & updated {len(created_courses)} official AKU courses with rich YouTube curriculum & pricing!"))
