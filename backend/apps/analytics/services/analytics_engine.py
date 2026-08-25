from django.db.models import Avg, Count, Q
from students.models import StudentProfile
from skills.models import StudentSkill, SkillGap, SkillGapSeverity
from assessments.models import AssessmentAttempt, AttemptStatus
from companies.models import Company, Opportunity, Application, OpportunityMatch, ApplicationStatus
from skills.services.gap_engine import calculate_student_skill_gaps
from companies.services.matching_engine import calculate_opportunity_matches_for_student


def get_student_analytics(student: StudentProfile):
    """
    Phase 13 — Student Analytics via dynamic ORM queries:
    - Career Readiness
    - Skill Progress
    - Top Skill Gaps
    - Assessment History
    - Recommended Opportunities
    """
    # 1. Skill Progress & Career Readiness
    student_skills = StudentSkill.objects.filter(student=student)
    avg_score = student_skills.aggregate(avg=Avg('score'))['avg'] or 0.0
    verified_count = student_skills.filter(is_verified=True).count()
    total_skills = student_skills.count()

    readiness_percentage = round(float(avg_score), 1)

    skill_progress_data = [
        {
            "id": str(ss.id),
            "skill_name": ss.skill.name,
            "category": ss.skill.category,
            "score": ss.score,
            "level": ss.level,
            "is_verified": ss.is_verified,
            "last_assessed_at": ss.last_assessed_at,
        }
        for ss in student_skills
    ]

    # 2. Top Skill Gaps
    gaps = calculate_student_skill_gaps(student)
    top_skill_gaps_data = [
        {
            "id": str(g.id),
            "skill_name": g.skill.name,
            "gap_score": g.gap_score,
            "severity": g.severity,
            "status": g.status,
        }
        for g in gaps[:5]
    ]

    # 3. Assessment History
    attempts = AssessmentAttempt.objects.filter(student=student)
    total_attempts = attempts.count()
    completed_attempts = attempts.filter(status=AttemptStatus.COMPLETED)
    passed_attempts = completed_attempts.filter(percentage__gte=60).count()

    avg_accuracy = completed_attempts.aggregate(avg=Avg('percentage'))['avg'] or 0.0

    # 4. Recommended Opportunities
    matches = calculate_opportunity_matches_for_student(student)
    top_matches_data = [
        {
            "match_id": str(m.id),
            "opportunity_title": m.opportunity.title,
            "company_name": m.opportunity.company.company_name,
            "match_score": m.match_score,
            "stipend_salary": m.opportunity.stipend_salary,
            "work_mode": m.opportunity.work_mode,
        }
        for m in matches[:5]
    ]

    return {
        "career_readiness": {
            "score_percentage": readiness_percentage,
            "verified_skills_count": verified_count,
            "total_skills_count": total_skills,
        },
        "skill_progress": skill_progress_data,
        "top_skill_gaps": top_skill_gaps_data,
        "assessment_history": {
            "total_attempts": total_attempts,
            "completed_attempts": completed_attempts.count(),
            "passed_attempts": passed_attempts,
            "average_accuracy": round(float(avg_accuracy), 1),
        },
        "recommended_opportunities": {
            "total_recommendations": matches.count(),
            "top_matches": top_matches_data,
        }
    }


def get_company_analytics(company: Company):
    """
    Phase 13 — Company Analytics via dynamic ORM queries:
    - Active Opportunities
    - Total Applications
    - Shortlisted Candidates
    - Top Matching Candidates
    """
    opportunities = Opportunity.objects.filter(company=company)
    active_opportunities_count = opportunities.filter(status='published').count()

    applications = Application.objects.filter(opportunity__company=company)
    total_applications_count = applications.count()

    shortlisted_candidates_count = applications.filter(
        status__in=[ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW, ApplicationStatus.SELECTED]
    ).count()

    # Top matching candidate applications
    matches = OpportunityMatch.objects.filter(opportunity__company=company).order_by('-match_score')
    top_matching_candidates_data = [
        {
            "student_id": str(m.student.id),
            "student_name": f"{m.student.user.first_name} {m.student.user.last_name}".strip() or m.student.user.email.split('@')[0],
            "opportunity_title": m.opportunity.title,
            "match_score": m.match_score,
        }
        for m in matches[:5]
    ]

    return {
        "active_opportunities": active_opportunities_count,
        "total_applications": total_applications_count,
        "shortlisted_candidates": shortlisted_candidates_count,
        "top_matching_candidates": top_matching_candidates_data,
    }


def get_academician_analytics(user=None):
    """
    Phase 13 — Academician / Institution Analytics via dynamic ORM queries:
    - Scoped to the specific institution of the authenticated user
    - Average Student Skill Scores
    - Top Skill Gaps across enrolled students
    - Student Readiness distribution
    - Placement Statistics
    """
    students_qs = StudentProfile.objects.all()
    if user and getattr(user, 'role', None) == 'academician' and hasattr(user, 'academician_profile'):
        inst = getattr(user.academician_profile, 'institution', None)
        if inst:
            students_qs = students_qs.filter(institution=inst)
        else:
            students_qs = StudentProfile.objects.none()

    total_students = students_qs.count()
    avg_score = StudentSkill.objects.filter(student__in=students_qs).aggregate(avg=Avg('score'))['avg'] or 0.0

    # Top skill gaps aggregate count for this cohort
    gaps_qs = SkillGap.objects.filter(student__in=students_qs).values('skill__name').annotate(gap_count=Count('id')).order_by('-gap_count')
    top_gaps_aggregate = [
        {"skill_name": item['skill__name'], "total_students_with_gap": item['gap_count']}
        for item in gaps_qs[:5]
    ]

    # Student Readiness distribution
    job_ready_students = students_qs.annotate(
        avg_s=Avg('skills__score')
    ).filter(avg_s__gte=75).count()

    improving_students = students_qs.annotate(
        avg_s=Avg('skills__score')
    ).filter(avg_s__gte=50, avg_s__lt=75).count()

    needs_focus_students = max(0, total_students - (job_ready_students + improving_students))

    # Placement statistics
    apps_qs = Application.objects.filter(student__in=students_qs)
    total_apps = apps_qs.count()
    shortlisted_apps = apps_qs.filter(
        status__in=[ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW, ApplicationStatus.SELECTED]
    ).count()

    selected_apps = apps_qs.filter(status=ApplicationStatus.SELECTED).count()

    return {
        "total_students": total_students,
        "average_student_skill_score": round(float(avg_score), 1),
        "top_skill_gaps": top_gaps_aggregate,
        "student_readiness": {
            "job_ready_count": job_ready_students,
            "improving_count": improving_students,
            "needs_focus_count": needs_focus_students,
        },
        "placement_statistics": {
            "total_applications": total_apps,
            "shortlisted_applications": shortlisted_apps,
            "selected_applications": selected_apps,
        }
    }


def get_admin_analytics():
    """
    Phase 13 — Admin & System Platform Analytics via dynamic ORM queries:
    - User Counts: Total Users, Students, Industry, Institutes, Admins
    - Verified User Accounts
    - Opportunities, Applications, and Active Courses
    """
    from accounts.models import User, UserRole
    from courses.models import LearningResource

    total_users = User.objects.count()
    students_count = User.objects.filter(role=UserRole.STUDENT).count()
    industry_count = User.objects.filter(role=UserRole.INDUSTRY).count()
    institute_count = User.objects.filter(role=UserRole.ACADEMICIAN).count()
    admins_count = User.objects.filter(role=UserRole.ADMIN).count()

    verified_students = User.objects.filter(role=UserRole.STUDENT, is_verified=True).count()
    verified_industry = User.objects.filter(role=UserRole.INDUSTRY, is_verified=True).count()
    verified_institute = User.objects.filter(role=UserRole.ACADEMICIAN, is_verified=True).count()
    verified_admins = User.objects.filter(role=UserRole.ADMIN, is_verified=True).count()

    companies_count = Company.objects.count()
    verified_companies = Company.objects.filter(is_verified=True).count()

    opportunities_count = Opportunity.objects.count()
    published_opportunities = Opportunity.objects.filter(status='published').count()
    applications_count = Application.objects.count()

    courses_count = LearningResource.objects.count()

    return {
        "total_users": total_users,
        "students_count": students_count,
        "industry_count": industry_count,
        "institute_count": institute_count,
        "admins_count": admins_count,
        "companies_count": companies_count,
        "verified_companies": verified_companies,
        "courses_count": courses_count,
        "opportunities_count": opportunities_count,
        "published_opportunities": published_opportunities,
        "applications_count": applications_count,
        "user_breakdown": {
            "students": {"total": students_count, "verified": verified_students},
            "industry": {"total": industry_count, "verified": verified_industry},
            "institute": {"total": institute_count, "verified": verified_institute},
            "admins": {"total": admins_count, "verified": verified_admins},
        },
        "system_health": 100,
    }


def get_industry_demand_analytics():
    """
    Computes real live industry skill demand and hiring trends directly from active Opportunity postings.
    """
    from companies.models import Opportunity, OpportunitySkillRequirement, Company, WorkMode, OpportunityType
    from django.db.models import Count, Avg, Q

    published_opps = Opportunity.objects.filter(status='published')
    total_drives = published_opps.count()

    # Skill Demand Query from live published requirements
    skills_qs = OpportunitySkillRequirement.objects.filter(
        opportunity__status='published'
    ).values('skill__name', 'skill__category').annotate(
        postings_count=Count('id'),
        avg_min_score=Avg('minimum_score')
    ).order_by('-postings_count')

    top_skills = [
        {
            "name": item['skill__name'],
            "category": item['skill__category'] or "Technical",
            "postings_count": item['postings_count'],
            "demand_percentage": round((item['postings_count'] / max(1, total_drives)) * 100) if total_drives > 0 else 0,
            "avg_benchmark": round(float(item['avg_min_score'] or 70))
        }
        for item in skills_qs[:10]
    ]

    # Top Hiring Companies
    companies_qs = Company.objects.filter(
        opportunities__status='published'
    ).annotate(
        active_drives=Count('opportunities', filter=Q(opportunities__status='published'))
    ).filter(active_drives__gt=0).order_by('-active_drives')[:8]

    top_companies = [
        {
            "id": str(c.id),
            "name": c.company_name,
            "logo": c.logo,
            "industry_type": c.industry_type or "Technology",
            "website": c.website,
            "active_posts": c.active_drives
        }
        for c in companies_qs
    ]

    # Work Mode breakdown
    remote_count = published_opps.filter(work_mode=WorkMode.REMOTE).count()
    hybrid_count = published_opps.filter(work_mode=WorkMode.HYBRID).count()
    onsite_count = published_opps.filter(work_mode=WorkMode.ONSITE).count()

    internships_count = published_opps.filter(opportunity_type=OpportunityType.INTERNSHIP).count()
    jobs_count = published_opps.filter(opportunity_type=OpportunityType.JOB).count()

    return {
        "total_active_drives": total_drives,
        "internships_count": internships_count,
        "jobs_count": jobs_count,
        "top_demanded_skills": top_skills,
        "top_hiring_companies": top_companies,
        "work_mode_distribution": {
            "remote": remote_count,
            "hybrid": hybrid_count,
            "onsite": onsite_count
        }
    }
