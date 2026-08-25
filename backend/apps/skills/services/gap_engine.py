from django.db import transaction
from django.utils import timezone
from students.models import StudentProfile
from skills.models import (
    CareerRole,
    CareerSkillRequirement,
    StudentSkill,
    SkillGap,
    SkillGapSeverity,
    SkillGapStatus,
)


@transaction.atomic
def calculate_student_skill_gaps(student: StudentProfile, career_role: CareerRole = None):
    """
    Phase 8 — Skill Gap Engine Service:
    Compares authenticated student's current skill scores against required skill scores
    for a target CareerRole and calculates gap_score, severity, and status.
    """
    if not career_role:
        if hasattr(student, 'career_goal') and student.career_goal:
            career_role = CareerRole.objects.filter(title__iexact=student.career_goal).first()
        if not career_role:
            career_role = CareerRole.objects.first()

    if not career_role:
        return []

    requirements = CareerSkillRequirement.objects.filter(career_role=career_role)
    gap_records = []

    for req in requirements:
        skill = req.skill
        required_score = req.required_score

        # Get student's current skill entry
        student_skill = StudentSkill.objects.filter(student=student, skill=skill).first()
        current_score = student_skill.score if student_skill else 0

        gap_score = max(required_score - current_score, 0)

        # Severity classification
        if gap_score > 20:
            severity = SkillGapSeverity.HIGH
        elif gap_score > 10:
            severity = SkillGapSeverity.MEDIUM
        else:
            severity = SkillGapSeverity.LOW

        # Status classification
        if current_score >= required_score:
            status = SkillGapStatus.RESOLVED
        elif current_score > 0:
            status = SkillGapStatus.IMPROVING
        else:
            status = SkillGapStatus.OPEN

        skill_gap, _ = SkillGap.objects.update_or_create(
            student=student,
            skill=skill,
            career_role=career_role,
            defaults={
                'current_score': current_score,
                'required_score': required_score,
                'gap_score': gap_score,
                'severity': severity,
                'status': status,
            }
        )
        gap_records.append(skill_gap)

    return gap_records
