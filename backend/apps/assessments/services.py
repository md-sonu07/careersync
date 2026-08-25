from django.utils import timezone
from django.db import transaction
from assessments.models import AssessmentAttempt, AttemptStatus, StudentAnswer
from skills.models import StudentSkill, SkillScoreHistory, SkillSource


@transaction.atomic
def calculate_assessment_result(attempt: AssessmentAttempt):
    """
    Service function for Phase 7:
    1. Evaluates all student answers for the attempt.
    2. Calculates total marks, score, and percentage.
    3. Marks attempt as completed.
    4. Updates or creates StudentSkill record with verified score.
    5. Logs SkillScoreHistory entry.
    """
    total_questions = attempt.assessment.questions.count()
    if total_questions == 0:
        attempt.score = 0.0
        attempt.percentage = 0.0
        attempt.status = AttemptStatus.COMPLETED
        attempt.completed_at = timezone.now()
        attempt.save()
        return attempt

    correct_count = 0
    answers = StudentAnswer.objects.filter(attempt=attempt)

    for ans in answers:
        if ans.selected_option and ans.selected_option.is_correct:
            ans.is_correct = True
            correct_count += 1
        else:
            ans.is_correct = False
        ans.save(update_fields=['is_correct'])

    percentage = (correct_count / total_questions) * 100.0
    score = (percentage / 100.0) * attempt.assessment.total_marks

    attempt.score = round(score, 2)
    attempt.percentage = round(percentage, 2)
    attempt.status = AttemptStatus.COMPLETED
    attempt.completed_at = timezone.now()
    attempt.save()

    # Update StudentSkill profile
    student = attempt.student
    skill = attempt.assessment.skill
    score_int = int(round(percentage))

    student_skill, _ = StudentSkill.objects.get_or_create(
        student=student,
        skill=skill,
        defaults={'score': score_int, 'source': SkillSource.ASSESSMENT}
    )

    student_skill.score = score_int
    student_skill.source = SkillSource.ASSESSMENT
    student_skill.last_assessed_at = timezone.now()
    if percentage >= 60.0:
        student_skill.is_verified = True
    student_skill.save()

    # Log SkillScoreHistory
    SkillScoreHistory.objects.create(
        student=student,
        skill=skill,
        score=score_int,
        source=SkillSource.ASSESSMENT
    )

    return attempt
