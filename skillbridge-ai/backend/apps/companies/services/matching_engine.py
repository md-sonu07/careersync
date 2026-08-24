from django.db import transaction
from students.models import StudentProfile
from skills.models import StudentSkill
from companies.models import Opportunity, OpportunityMatch, OpportunityStatus


@transaction.atomic
def calculate_opportunity_matches_for_student(student: StudentProfile):
    """
    Phase 11 — Opportunity Matching Engine Service:
    Calculates weighted skill compatibility match scores for a student against all published opportunities.
    """
    published_opportunities = Opportunity.objects.filter(status=OpportunityStatus.PUBLISHED)
    student_skills_map = {
        ss.skill_id: ss.score for ss in StudentSkill.objects.filter(student=student)
    }

    match_records = []

    for opp in published_opportunities:
        requirements = opp.skill_requirements.all()
        if not requirements.exists():
            skill_match_score = 75.0
        else:
            weighted_score_sum = 0.0
            total_weight = 0.0

            for req in requirements:
                student_score = student_skills_map.get(req.skill_id, 0)
                if req.minimum_score > 0:
                    if student_score >= req.minimum_score:
                        ratio = 1.0
                    else:
                        ratio = student_score / req.minimum_score
                else:
                    ratio = 1.0

                weighted_score_sum += ratio * req.weight * 100.0
                total_weight += req.weight

            skill_match_score = round(weighted_score_sum / total_weight, 2) if total_weight > 0 else 75.0

        match_score = round(min(100.0, max(0.0, skill_match_score)), 2)

        match_obj, _ = OpportunityMatch.objects.update_or_create(
            student=student,
            opportunity=opp,
            defaults={
                'match_score': match_score,
                'skill_match_score': skill_match_score,
            }
        )
        match_records.append(match_obj)

    return OpportunityMatch.objects.filter(student=student).order_by('-match_score')
