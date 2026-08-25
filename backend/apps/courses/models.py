import uuid
from django.db import models
from skills.models import Skill
from assessments.models import DifficultyLevel
from students.models import StudentProfile


class ResourceType(models.TextChoices):
    ARTICLE = 'article', 'Article'
    VIDEO = 'video', 'Video'
    COURSE = 'course', 'Course'
    PROJECT = 'project', 'Project'
    DOCUMENTATION = 'documentation', 'Documentation'


class RecommendationPriority(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM = 'medium', 'Medium'
    HIGH = 'high', 'High'


class RecommendationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    IN_PROGRESS = 'in_progress', 'In Progress'
    COMPLETED = 'completed', 'Completed'


class LearningResource(models.Model):
    """
    Curated learning resource (article, video, course, capstone project) attached to a skill.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='learning_resources'
    )
    level = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.BEGINNER
    )
    resource_type = models.CharField(
        max_length=50,
        choices=ResourceType.choices,
        default=ResourceType.COURSE
    )
    content_url = models.URLField(blank=True)
    duration_minutes = models.PositiveIntegerField(
        default=60,
        help_text="Estimated completion time in minutes"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'courses'
        ordering = ['-created_at']
        verbose_name = 'Learning Resource'
        verbose_name_plural = 'Learning Resources'

    def __str__(self):
        return f"{self.title} ({self.skill.name} - {self.resource_type})"


class LearningRecommendation(models.Model):
    """
    Personalized AI/Gap-driven recommendation generated for a student.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='recommendations'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='skill_recommendations'
    )
    resource = models.ForeignKey(
        LearningResource,
        on_delete=models.CASCADE,
        related_name='resource_recommendations'
    )
    priority = models.CharField(
        max_length=50,
        choices=RecommendationPriority.choices,
        default=RecommendationPriority.MEDIUM
    )
    status = models.CharField(
        max_length=50,
        choices=RecommendationStatus.choices,
        default=RecommendationStatus.PENDING
    )
    recommended_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'courses'
        ordering = ['-priority', '-created_at']
        verbose_name = 'Learning Recommendation'
        verbose_name_plural = 'Learning Recommendations'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'resource'],
                name='unique_student_resource_recommendation'
            )
        ]

    def __str__(self):
        return f"{self.student.user.email} -> {self.resource.title} [{self.priority}] ({self.status})"
