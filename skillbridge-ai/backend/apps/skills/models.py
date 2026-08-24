import uuid
from django.db import models
from django.conf import settings
from students.models import StudentProfile


class SkillCategory(models.TextChoices):
    PROGRAMMING = 'Programming', 'Programming'
    FRONTEND = 'Frontend', 'Frontend'
    BACKEND = 'Backend', 'Backend'
    DATABASE = 'Database', 'Database'
    DEVOPS = 'DevOps', 'DevOps'
    CLOUD = 'Cloud', 'Cloud'
    AIML = 'AI/ML', 'AI/ML'
    CYBERSECURITY = 'Cybersecurity', 'Cybersecurity'
    SOFT_SKILL = 'Soft Skill', 'Soft Skill'
    OTHER = 'Other', 'Other'


class SkillSource(models.TextChoices):
    MANUAL = 'manual', 'Manual Entry'
    RESUME = 'resume', 'Resume Parsing'
    ASSESSMENT = 'assessment', 'Skill Assessment'
    PRACTICE = 'practice', 'AI Practice'


class Skill(models.Model):
    """
    Core Skill entity in CareerSync intelligence database.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, unique=True, db_index=True)
    category = models.CharField(
        max_length=100,
        choices=SkillCategory.choices,
        default=SkillCategory.PROGRAMMING,
        db_index=True
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'skills'
        ordering = ['name']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'

    def __str__(self):
        return f"{self.name} ({self.category})"


class CareerRole(models.Model):
    """
    Industry Career Role profile (e.g. Full Stack Developer, AI Engineer).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=150, unique=True, db_index=True)
    category = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'skills'
        ordering = ['title']
        verbose_name = 'Career Role'
        verbose_name_plural = 'Career Roles'

    def __str__(self):
        return self.title


class CareerSkillRequirement(models.Model):
    """
    Required skill benchmarks for a specific CareerRole.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    career_role = models.ForeignKey(
        CareerRole,
        on_delete=models.CASCADE,
        related_name='skill_requirements'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='career_requirements'
    )
    required_score = models.PositiveIntegerField(default=70)
    weight = models.FloatField(default=1.0)
    is_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'skills'
        ordering = ['-required_score']
        verbose_name = 'Career Skill Requirement'
        verbose_name_plural = 'Career Skill Requirements'
        constraints = [
            models.UniqueConstraint(
                fields=['career_role', 'skill'],
                name='unique_career_role_skill'
            )
        ]

    def __str__(self):
        return f"{self.career_role.title} -> {self.skill.name} (Min: {self.required_score}%)"


class StudentSkill(models.Model):
    """
    Student's current skill proficiency and score.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='skills'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='student_skills'
    )
    score = models.PositiveIntegerField(default=0)
    level = models.CharField(max_length=50, default='Beginner')
    source = models.CharField(
        max_length=50,
        choices=SkillSource.choices,
        default=SkillSource.MANUAL
    )
    last_assessed_at = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_level(self):
        if self.score >= 80:
            return 'Expert'
        elif self.score >= 65:
            return 'Advanced'
        elif self.score >= 40:
            return 'Intermediate'
        return 'Beginner'

    def save(self, *args, **kwargs):
        if self.score is not None and not kwargs.get('update_fields') or 'score' in (kwargs.get('update_fields') or []):
            self.level = self.calculate_level()
        super().save(*args, **kwargs)

    class Meta:
        app_label = 'skills'
        ordering = ['-score']
        verbose_name = 'Student Skill'
        verbose_name_plural = 'Student Skills'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'skill'],
                name='unique_student_skill'
            )
        ]

    def __str__(self):
        return f"{self.student.user.email} - {self.skill.name}: {self.score}% ({self.level})"


class SkillScoreHistory(models.Model):
    """
    Historical log of student skill score progression.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='score_history'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='score_history'
    )
    score = models.PositiveIntegerField()
    source = models.CharField(max_length=50, default='manual')
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'skills'
        ordering = ['-recorded_at']
        verbose_name = 'Skill Score History'
        verbose_name_plural = 'Skill Score Histories'

    def __str__(self):
        return f"{self.student.user.email} - {self.skill.name}: {self.score}% on {self.recorded_at.strftime('%Y-%m-%d')}"


class SkillGapSeverity(models.TextChoices):
    LOW = 'Low', 'Low'
    MEDIUM = 'Medium', 'Medium'
    HIGH = 'High', 'High'


class SkillGapStatus(models.TextChoices):
    OPEN = 'open', 'Open'
    IMPROVING = 'improving', 'Improving'
    RESOLVED = 'resolved', 'Resolved'


class SkillGap(models.Model):
    """
    Skill gap analysis comparing student score against target career role benchmark.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='skill_gaps'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='gaps'
    )
    career_role = models.ForeignKey(
        CareerRole,
        on_delete=models.CASCADE,
        related_name='gaps',
        null=True,
        blank=True
    )
    current_score = models.PositiveIntegerField(default=0)
    required_score = models.PositiveIntegerField(default=0)
    gap_score = models.PositiveIntegerField(default=0)
    severity = models.CharField(
        max_length=50,
        choices=SkillGapSeverity.choices,
        default=SkillGapSeverity.LOW
    )
    status = models.CharField(
        max_length=50,
        choices=SkillGapStatus.choices,
        default=SkillGapStatus.OPEN
    )
    calculated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'skills'
        ordering = ['-gap_score']
        verbose_name = 'Skill Gap'
        verbose_name_plural = 'Skill Gaps'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'skill', 'career_role'],
                name='unique_student_skill_gap'
            )
        ]

    def __str__(self):
        return f"{self.student.user.email} - {self.skill.name} Gap: {self.gap_score}% [{self.severity}] ({self.status})"

