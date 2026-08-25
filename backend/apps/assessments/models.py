import uuid
from django.db import models
from django.conf import settings
from skills.models import Skill
from students.models import StudentProfile


class DifficultyLevel(models.TextChoices):
    BEGINNER = 'Beginner', 'Beginner'
    INTERMEDIATE = 'Intermediate', 'Intermediate'
    ADVANCED = 'Advanced', 'Advanced'
    EXPERT = 'Expert', 'Expert'


class AttemptStatus(models.TextChoices):
    STARTED = 'started', 'Started'
    COMPLETED = 'completed', 'Completed'
    EXPIRED = 'expired', 'Expired'


class Assessment(models.Model):
    """
    Skill-based Assessment definition (e.g., Python Backend Assessment, React Fundamentals).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='assessments'
    )
    difficulty = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE
    )
    time_limit = models.PositiveIntegerField(
        default=15,
        help_text="Time limit in minutes"
    )
    total_marks = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'assessments'
        ordering = ['-created_at']
        verbose_name = 'Assessment'
        verbose_name_plural = 'Assessments'

    def __str__(self):
        return f"{self.title} ({self.skill.name} - {self.difficulty})"


class Question(models.Model):
    """
    MCQ or Coding Question attached to an Assessment.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='questions',
        null=True,
        blank=True
    )
    question_text = models.TextField()
    difficulty = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE
    )
    explanation = models.TextField(
        blank=True,
        help_text="Explanation shown after attempt submission"
    )
    is_ai_generated = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'assessments'
        ordering = ['created_at']
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'

    def __str__(self):
        return f"{self.assessment.title} - Q: {self.question_text[:50]}"


class QuestionOption(models.Model):
    """
    Option choice for an Assessment Question.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )
    option_text = models.TextField()
    is_correct = models.BooleanField(default=False)

    class Meta:
        app_label = 'assessments'
        verbose_name = 'Question Option'
        verbose_name_plural = 'Question Options'

    def __str__(self):
        return f"Q({self.question.id}) Option: {self.option_text[:30]} ({'Correct' if self.is_correct else 'Incorrect'})"


class AssessmentAttempt(models.Model):
    """
    Record of a student taking an Assessment.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='assessment_attempts'
    )
    assessment = models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    score = models.FloatField(default=0.0)
    percentage = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=50,
        choices=AttemptStatus.choices,
        default=AttemptStatus.STARTED
    )
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        app_label = 'assessments'
        ordering = ['-started_at']
        verbose_name = 'Assessment Attempt'
        verbose_name_plural = 'Assessment Attempts'

    def __str__(self):
        return f"{self.student.user.email} - {self.assessment.title}: {self.percentage}% ({self.status})"


class StudentAnswer(models.Model):
    """
    Student's selected option answer for a specific question in an attempt.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attempt = models.ForeignKey(
        AssessmentAttempt,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )
    selected_option = models.ForeignKey(
        QuestionOption,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'assessments'
        verbose_name = 'Student Answer'
        verbose_name_plural = 'Student Answers'
        constraints = [
            models.UniqueConstraint(
                fields=['attempt', 'question'],
                name='unique_attempt_question'
            )
        ]

    def __str__(self):
        return f"Attempt({self.attempt.id}) - Q({self.question.id}): {'Correct' if self.is_correct else 'Wrong'}"
