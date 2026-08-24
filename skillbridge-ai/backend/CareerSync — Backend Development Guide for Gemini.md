# CareerSync — Backend Development Guide for Gemini
## React + Django REST Framework (DRF) Backend Development Roadmap

> **Project Name:** CareerSync  
> **Backend:** Django + Django REST Framework  
> **Frontend:** React  
> **Database:** PostgreSQL  
> **Authentication:** JWT  
> **Development Approach:** Step-by-step, modular, production-oriented

---

# 1. Project Overview

CareerSync is an **Industry-Driven AI Skill Development and Career Platform**.

The platform connects three major stakeholders:

1. **Students** — Assess their skills, identify skill gaps, practice, improve, and discover relevant internships/jobs.
2. **Industry/Companies** — Define skill requirements, create opportunities, and find matching candidates.
3. **Academicians/Institutions** — Analyze aggregated student skills and compare them with industry demand.

The platform also has a separate **Admin system** for management and verification.

---

# 2. Core Product Flow

```text
Student Registration
        ↓
Select Career Goal
        ↓
Add/Import Skills
        ↓
Skill Assessment
        ↓
Skill Score Calculation
        ↓
Student Skill Profile
        ↓
Industry Requirement Comparison
        ↓
Skill Gap Detection
        ↓
Personalized Learning / Practice
        ↓
Re-Assessment
        ↓
Updated Skill Score
        ↓
Opportunity Matching
        ↓
Internship / Job Application
```

---

# 3. Backend Development Rules

When developing this backend, follow these rules:

- Use Django REST Framework.
- Use a custom User model from the beginning.
- Use PostgreSQL for production/development database.
- Use JWT authentication.
- Keep each domain in a separate Django app.
- Use `UUIDField` or standard Django IDs consistently.
- Use `ModelSerializer` for standard CRUD APIs.
- Use service functions for complex business logic.
- Keep views thin.
- Put calculations such as skill gaps and match scores in backend services, not React.
- Use permissions for role-based access control.
- Never trust the role sent by the frontend without verifying the authenticated user.
- Use environment variables for secrets.
- Add timestamps (`created_at`, `updated_at`) where useful.
- Add database constraints for important business rules.
- Build and test one module at a time.

---

# 4. Recommended Backend Structure

```text
backend/
│
├── config/
│   ├── settings/
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   ├── accounts/
│   ├── institutions/
│   ├── students/
│   ├── companies/
│   ├── skills/
│   ├── careers/
│   ├── assessments/
│   ├── learning/
│   ├── opportunities/
│   ├── matching/
│   ├── applications/
│   └── analytics/
│
├── requirements/
├── manage.py
├── .env
└── requirements.txt
```

---

# 5. Development Order

Do not build everything together.

Follow this exact order:

```text
Phase 1  → Project Setup
Phase 2  → Custom User + JWT Authentication
Phase 3  → Institution, Student, Company, Academician Profiles
Phase 4  → Skills and Career Roles
Phase 5  → Student Skill Management
Phase 6  → Assessment System
Phase 7  → Skill Score Calculation and History
Phase 8  → Skill Gap Engine
Phase 9  → Learning Recommendations
Phase 10 → Opportunity Management
Phase 11 → Opportunity Matching Engine
Phase 12 → Applications
Phase 13 → Analytics
Phase 14 → AI Integration
Phase 15 → Testing and API Documentation
```

---

# PHASE 1 — Project Setup

## Goal

Create the Django project and prepare it for DRF development.

### Tasks

- Create a virtual environment.
- Install Django and Django REST Framework.
- Install PostgreSQL driver.
- Install environment variable support.
- Create Django project named `config`.
- Create `apps` directory.
- Configure PostgreSQL.
- Configure `.env`.
- Configure CORS for React frontend.
- Create basic health-check API.

### Suggested Packages

```text
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
psycopg
python-dotenv
Pillow
```

### Expected API

```text
GET /api/health/
```

Response:

```json
{
  "status": "ok",
  "message": "CareerSync API is running"
}
```

### Completion Criteria

- Server runs successfully.
- PostgreSQL connection works.
- Health API works.
- CORS is configured for React.

---

# PHASE 2 — Custom User and Authentication

## Goal

Build the common authentication system.

There should be one common User model.

## User Roles

```text
student
industry
Institute
admin
```

## User Model Fields

```text
id
email
first_name
last_name
role
is_active
is_verified
created_at
updated_at
```

Use email as the login field.

## Required APIs

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/token/refresh/
GET  /api/auth/me/
POST /api/auth/logout/ (optional token blacklist)
```

## Important Rules

- Password must be hashed by Django.
- Use JWT.
- User role must be stored in the database.
- `/me/` should return authenticated user information.
- React should never decide authorization by itself.

## Completion Criteria

A Student, Industry user, and Academician can register and login.

---

# PHASE 3 — Profiles and Institutions

## Goal

Create role-specific profiles.

---

## Institution Model

Fields:

```text
id
name
institution_type
website
city
state
country
is_verified
created_at
updated_at
```

---

## StudentProfile

Fields:

```text
user → OneToOne User
institution → ForeignKey Institution
enrollment_number
course
specialization
semester
graduation_year
career_goal → ForeignKey CareerRole (added later)
bio
resume
linkedin_url
github_url
```

---

## Company

Fields:

```text
user → OneToOne User
company_name
official_email
website
industry_type
company_size
description
logo
is_verified
```

---

## AcademicianProfile

Fields:

```text
user → OneToOne User
institution → ForeignKey Institution
designation
department
```

---

## APIs

Create profile APIs:

```text
GET    /api/students/profile/
PATCH  /api/students/profile/

GET    /api/companies/profile/
PATCH  /api/companies/profile/

GET    /api/Institutes/profile/
PATCH  /api/Institutes/profile/
```

---

# PHASE 4 — Skills and Career Roles

## Goal

Create the core skill intelligence database.

---

## Skill Model

```text
id
name
category
description
is_active
created_at
```

Possible categories:

```text
Programming
Frontend
Backend
Database
DevOps
Cloud
AI/ML
Cybersecurity
Soft Skill
```

Add a unique constraint on `name`.

---

## CareerRole Model

```text
id
title
category
description
is_active
```

Examples:

```text
Full Stack Developer
Frontend Developer
Backend Developer
Data Analyst
AI Engineer
DevOps Engineer
```

---

## CareerSkillRequirement

This defines what skills are generally required for a career.

```text
career_role → CareerRole
skill → Skill
required_score
weight
is_required
```

Important:

```text
One career role + one skill = one requirement
```

Add a unique constraint.

---

# PHASE 5 — Student Skills

## StudentSkill Model

This represents the student's current skill profile.

Fields:

```text
student → StudentProfile
skill → Skill
score (0–100)
level
source
last_assessed_at
is_verified
```

Possible sources:

```text
manual
resume
assessment
practice
```

## Important Rule

A student should have only one current record for each skill.

```text
Student + Skill = Unique
```

---

## SkillScoreHistory

Store historical progress.

```text
student
skill
score
source
recorded_at
```

This will later power progress charts.

---

## APIs

```text
GET    /api/skills/
GET    /api/students/my-skills/
POST   /api/students/my-skills/
PATCH  /api/students/my-skills/{id}/
```

---

# PHASE 6 — Assessment System

## Goal

Students should be able to take skill-based assessments.

---

## Assessment

Fields:

```text
title
description
skill
difficulty
time_limit
total_marks
is_active
```

---

## Question

Fields:

```text
assessment
skill
question_text
difficulty
explanation
is_ai_generated
created_by
created_at
```

---

## QuestionOption

Fields:

```text
question
option_text
is_correct
```

---

## AssessmentAttempt

Fields:

```text
student
assessment
score
percentage
status
started_at
completed_at
```

Status:

```text
started
completed
expired
```

---

## StudentAnswer

Fields:

```text
attempt
question
selected_option
is_correct
answered_at
```

---

## Important Assessment Flow

```text
Student starts assessment
        ↓
AssessmentAttempt created
        ↓
Questions are returned
        ↓
Student submits answers
        ↓
Backend validates answers
        ↓
Backend calculates score
        ↓
Attempt marked completed
        ↓
StudentSkill updated
        ↓
SkillScoreHistory created
```

### Critical Security Rule

The frontend must never send `is_correct=True`.

The backend must determine whether an answer is correct.

---

# PHASE 7 — Skill Score Calculation

Create a service:

```text
apps/assessments/services.py
```

Example responsibility:

```text
calculate_assessment_result(attempt)
```

The service should:

1. Calculate correct answers.
2. Calculate percentage.
3. Update AssessmentAttempt.
4. Update StudentSkill.
5. Create SkillScoreHistory.

Keep this logic outside React.

---

# PHASE 8 — Skill Gap Engine

## SkillGap Model

Fields:

```text
student
skill
career_role
current_score
required_score
gap_score
severity
status
calculated_at
```

Severity:

```text
0–10    → Low
11–20   → Medium
21+     → High
```

Status:

```text
open
improving
resolved
```

---

## Skill Gap Calculation Service

Create:

```text
apps/skills/services/gap_engine.py
```

Flow:

```text
Student Skill Score
        ↓
Compare with
Career Skill Requirement
        ↓
Calculate Gap
        ↓
Assign Severity
        ↓
Store/Update SkillGap
```

Formula:

```text
gap_score = max(required_score - current_score, 0)
```

If:

```text
current_score >= required_score
```

Then:

```text
status = resolved
```

---

# PHASE 9 — Learning Recommendations

## LearningResource

Fields:

```text
title
description
skill
level
resource_type
content_url
duration_minutes
is_active
```

Resource types:

```text
article
video
course
project
documentation
```

---

## LearningRecommendation

Fields:

```text
student
skill
resource
priority
status
recommended_reason
created_at
```

Priority:

```text
low
medium
high
```

Status:

```text
pending
in_progress
completed
```

Recommendation logic:

```text
High Skill Gap
      ↓
High Priority Learning Resources
```

---

# PHASE 10 — Opportunities

Use one unified Opportunity model.

Do not create separate Job and Internship models initially.

## Opportunity

Fields:

```text
company
title
opportunity_type
description
location
work_mode
duration
deadline
status
created_at
updated_at
```

Opportunity types:

```text
internship
job
```

Work modes:

```text
remote
hybrid
onsite
```

Status:

```text
draft
published
closed
```

---

## OpportunitySkillRequirement

Fields:

```text
opportunity
skill
minimum_score
weight
is_required
```

Important:

```text
Opportunity + Skill = Unique
```

---

## Required APIs

```text
GET    /api/opportunities/
POST   /api/opportunities/
GET    /api/opportunities/{id}/
PATCH  /api/opportunities/{id}/
DELETE /api/opportunities/{id}/
```

Only the owning company should be able to edit its opportunities.

---

# PHASE 11 — Opportunity Matching Engine

## OpportunityMatch

Fields:

```text
student
opportunity
match_score
skill_match_score
calculated_at
```

For MVP, keep matching simple.

## Matching Formula

For every required skill:

```text
Student Score
        vs
Required Score
```

Calculate weighted compatibility.

Conceptually:

```text
Match Score =
Σ (Skill Compatibility × Skill Weight)
```

Important rules:

- Backend calculates the score.
- React only displays the result.
- Recalculate when StudentSkill changes.
- Recalculate when opportunity requirements change.

---

# PHASE 12 — Applications

## Application

Fields:

```text
student
opportunity
resume
cover_letter
status
applied_at
updated_at
```

Status:

```text
applied
under_review
shortlisted
interview
selected
rejected
withdrawn
```

Important constraint:

```text
One Student + One Opportunity = One Application
```

---

## ApplicationStatusHistory

Fields:

```text
application
old_status
new_status
changed_by
remarks
created_at
```

---

## Required APIs

Student:

```text
POST /api/opportunities/{id}/apply/
GET  /api/applications/my/
```

Company:

```text
GET   /api/company/applications/
PATCH /api/applications/{id}/status/
```

---

# PHASE 13 — Analytics

Do not create unnecessary analytics tables initially.

Calculate analytics using database queries.

---

## Student Analytics

```text
Career Readiness
Skill Progress
Top Skill Gaps
Assessment History
Recommended Opportunities
```

---

## Company Analytics

```text
Active Opportunities
Total Applications
Shortlisted Candidates
Top Matching Candidates
```

---

## Academician Analytics

Use aggregated student data.

```text
Average Student Skill Scores
Top Skill Gaps
Industry Demand
Student Readiness
Placement Statistics
```

Important:

Do not expose unnecessary private student information in aggregate analytics.

---

# PHASE 14 — AI Integration

AI should be an additional layer, not the core backend dependency.

AI can help with:

1. MCQ generation.
2. Question explanation.
3. Resume skill extraction.
4. Learning recommendations.
5. Job description skill extraction.

---

## AI Service Structure

```text
apps/ai/
├── services/
│   ├── mcq_generator.py
│   ├── resume_analyzer.py
│   ├── skill_extractor.py
│   └── learning_recommender.py
```

Important:

- Validate AI output before saving.
- Do not trust AI-generated data blindly.
- Store generated questions for reuse if appropriate.
- The Skill Gap and Matching Engine must work even if the AI service is unavailable.

---

# PHASE 15 — Permissions

Create custom DRF permissions.

Examples:

```text
IsStudent
IsIndustry
IsAcademician
IsAdminUser
IsVerifiedCompany
```

Example rule:

```text
Student
→ Can only access own profile and applications.

Company
→ Can only manage own opportunities.

Academician
→ Can access institution-level analytics.

Admin
→ Can manage the complete platform.
```

---

# Recommended API URL Structure

```text
/api/auth/
/api/students/
/api/companies/
/api/Institutes/
/api/institutions/
/api/skills/
/api/careers/
/api/assessments/
/api/learning/
/api/opportunities/
/api/matching/
/api/applications/
/api/analytics/
```

---

# Important Database Relationships

```text
User
├── StudentProfile
├── Company
└── AcademicianProfile

Institution
├── StudentProfile
└── AcademicianProfile

StudentProfile
├── StudentSkill
├── AssessmentAttempt
├── SkillGap
├── LearningRecommendation
├── OpportunityMatch
├── Application
└── StudentProject

Skill
├── StudentSkill
├── CareerSkillRequirement
├── Assessment
├── Question
├── SkillGap
└── OpportunitySkillRequirement

Opportunity
├── OpportunitySkillRequirement
├── OpportunityMatch
└── Application
```

---

# Final MVP Priority

For the first working version, build these modules:

## Must Have

```text
1. Custom User + JWT
2. Student Profile
3. Company Profile
4. Institution + Academician Profile
5. Skills
6. Student Skills
7. Career Roles + Requirements
8. Assessment
9. Assessment Attempt
10. Skill Score Update
11. Skill Gap
12. Opportunity
13. Opportunity Requirements
14. Matching
15. Application
```

## Build Later

```text
AI Resume Parsing
Advanced AI Recommendations
Notifications
Certificates
Interview Scheduling
Advanced Reports
Complex Career Readiness Simulator
```

---

# Instructions for Gemini

When helping develop this project, follow these rules:

1. Work on **only one phase at a time**.
2. Before writing code, explain the goal and architecture briefly.
3. Generate code for the current phase only.
4. Do not generate future modules unless requested.
5. Use clean, beginner-friendly code.
6. Explain every important file.
7. After completing a phase, provide:
   - Files created/changed.
   - Migration commands.
   - API endpoints.
   - Example request/response.
   - Testing steps.
8. Do not skip migrations.
9. Do not modify existing working code unnecessarily.
10. Always consider database relationships and permissions.
11. Keep business logic in services where appropriate.
12. Never put sensitive keys directly into source code.

---

# FIRST GEMINI PROMPT

Copy the following prompt into Gemini when starting:

> We are building the backend for a project called CareerSync using Django REST Framework and PostgreSQL. The complete project architecture and database design are provided in this document. We will build the backend step by step, one phase at a time. Do not generate the entire project at once. First, read and understand this document. Then start with **PHASE 1 — Project Setup** only. Explain what we are doing, provide the exact commands and code, and wait for my confirmation before moving to the next phase. Keep the code clean, modular, beginner-friendly, and compatible with React as the frontend.

---

# Final Development Principle

```text
Build Small
    ↓
Test Properly
    ↓
Verify APIs
    ↓
Commit to Git
    ↓
Move to Next Module
```

> **Never build the entire project in one shot.**
>
> Build the CareerSync backend module by module, test each API, and then move forward.