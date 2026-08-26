from django.db import transaction
from students.models import StudentProfile
from skills.models import SkillGap, SkillGapSeverity
from skills.services.gap_engine import calculate_student_skill_gaps
from courses.models import (
    LearningResource,
    LearningRecommendation,
    RecommendationPriority,
    RecommendationStatus,
)


@transaction.atomic
def generate_learning_recommendations(student: StudentProfile):
    """
    Phase 9 — Learning Recommendation Engine Service:
    Evaluates student's SkillGap records and generates prioritized recommendations
    for matching LearningResources.
    """
    # 1. Ensure up-to-date skill gaps exist
    gaps = calculate_student_skill_gaps(student)
    recommendations = []

    for gap in gaps:
        if gap.status == 'resolved':
            continue

        resources = LearningResource.objects.filter(skill=gap.skill, is_active=True)
        if not resources.exists():
            continue

        # Priority determination based on gap severity
        if gap.severity == SkillGapSeverity.HIGH:
            priority = RecommendationPriority.HIGH
        elif gap.severity == SkillGapSeverity.MEDIUM:
            priority = RecommendationPriority.MEDIUM
        else:
            priority = RecommendationPriority.LOW

        reason = (
          f"Recommended because {gap.skill.name} has a {gap.gap_score}% gap "
          f"against your target benchmark."
        )

        for res in resources:
            rec, _ = LearningRecommendation.objects.update_or_create(
                student=student,
                resource=res,
                defaults={
                    'skill': gap.skill,
                    'priority': priority,
                    'reason': reason,
                }
            )
            recommendations.append(rec)

    # If student has no gaps, recommend popular courses
    if not recommendations:
        all_resources = LearningResource.objects.filter(is_active=True)[:5]
        for res in all_resources:
            rec, _ = LearningRecommendation.objects.update_or_create(
                student=student,
                resource=res,
                defaults={
                    'skill': res.skill,
                    'priority': RecommendationPriority.LOW,
                    'reason': "Explore popular skill modules to expand your profile.",
                }
            )
            recommendations.append(rec)

    return LearningRecommendation.objects.filter(student=student)
