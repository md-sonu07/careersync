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


class EnrollmentStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'


class PaymentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    SUCCESS = 'success', 'Success'
    FAILED = 'failed', 'Failed'


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
    institution = models.ForeignKey(
        'institutions.Institution',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='learning_resources'
    )
    instructor_name = models.CharField(max_length=150, blank=True)
    thumbnail_url = models.TextField(null=True, blank=True)
    rating = models.FloatField(default=4.8)
    enrolled_count = models.PositiveIntegerField(default=0)
    
    # Pricing & Access
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_free = models.BooleanField(default=False)
    certificate_included = models.BooleanField(default=True)
    
    # Dynamic Curriculum & Learning Outcomes
    what_you_will_learn = models.JSONField(default=list, blank=True)
    curriculum = models.JSONField(default=list, blank=True)
    faqs = models.JSONField(default=list, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'courses'
        ordering = ['-created_at']
        verbose_name = 'Learning Resource'
        verbose_name_plural = 'Learning Resources'

    def __str__(self):
        return f"{self.title} ({self.skill.name} - {self.resource_type})"


class CourseEnrollment(models.Model):
    """
    Tracks a student's active enrollment and learning progress in a course.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='course_enrollments'
    )
    resource = models.ForeignKey(
        LearningResource,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    status = models.CharField(
        max_length=20,
        choices=EnrollmentStatus.choices,
        default=EnrollmentStatus.ACTIVE
    )
    progress_percent = models.PositiveIntegerField(default=0)
    completed_lessons = models.JSONField(default=list, blank=True)
    last_played_lesson_id = models.CharField(max_length=100, blank=True)
    
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    certificate_id = models.CharField(max_length=100, blank=True)

    class Meta:
        app_label = 'courses'
        ordering = ['-enrolled_at']
        unique_together = ('student', 'resource')
        verbose_name = 'Course Enrollment'
        verbose_name_plural = 'Course Enrollments'

    def __str__(self):
        return f"{self.student.user.full_name} -> {self.resource.title} ({self.progress_percent}%)"


class CoursePayment(models.Model):
    """
    Tracks payment transactions made for paid courses.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.OneToOneField(
        CourseEnrollment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payment_record'
    )
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='course_payments'
    )
    resource = models.ForeignKey(
        LearningResource,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='UPI')
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.SUCCESS
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'courses'
        ordering = ['-created_at']
        verbose_name = 'Course Payment'
        verbose_name_plural = 'Course Payments'

    def __str__(self):
        return f"₹{self.amount} by {self.student.user.full_name} ({self.status})"


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
    reason = models.TextField(blank=True)
    status = models.CharField(
        max_length=50,
        choices=RecommendationStatus.choices,
        default=RecommendationStatus.PENDING
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'courses'
        ordering = ['-created_at']
        verbose_name = 'Learning Recommendation'
        verbose_name_plural = 'Learning Recommendations'

    def __str__(self):
        return f"Recommendation: {self.student.user.email} -> {self.resource.title}"
