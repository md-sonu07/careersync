import uuid
from django.db import models
from django.conf import settings
from skills.models import Skill


class CompanySize(models.TextChoices):
    MICRO = '1-10', '1-10 employees'
    SMALL = '11-50', '11-50 employees'
    MEDIUM = '51-200', '51-200 employees'
    LARGE = '201-500', '201-500 employees'
    ENTERPRISE = '500+', '500+ employees'


class OpportunityType(models.TextChoices):
    INTERNSHIP = 'internship', 'Internship'
    JOB = 'job', 'Job'


class WorkMode(models.TextChoices):
    REMOTE = 'remote', 'Remote'
    HYBRID = 'hybrid', 'Hybrid'
    ONSITE = 'onsite', 'Onsite'


class OpportunityStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    PUBLISHED = 'published', 'Published'
    CLOSED = 'closed', 'Closed'


class Company(models.Model):
    """
    Model representing an Industry / Company user profile.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='company_profile'
    )
    company_name = models.CharField(max_length=255)
    official_email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    industry_type = models.CharField(max_length=150, blank=True)
    company_size = models.CharField(
        max_length=50,
        choices=CompanySize.choices,
        default=CompanySize.SMALL
    )
    description = models.TextField(blank=True)
    logo = models.TextField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'companies'
        ordering = ['company_name']
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"


class Opportunity(models.Model):
    """
    Unified model for Internship and Job postings by companies.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='opportunities'
    )
    title = models.CharField(max_length=250)
    opportunity_type = models.CharField(
        max_length=50,
        choices=OpportunityType.choices,
        default=OpportunityType.INTERNSHIP
    )
    description = models.TextField()
    location = models.CharField(max_length=150, default='Remote')
    work_mode = models.CharField(
        max_length=50,
        choices=WorkMode.choices,
        default=WorkMode.REMOTE
    )
    duration = models.CharField(max_length=100, default='6 months')
    stipend_salary = models.CharField(max_length=100, blank=True, default='₹25k/mo')
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=50,
        choices=OpportunityStatus.choices,
        default=OpportunityStatus.PUBLISHED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'companies'
        ordering = ['-created_at']
        verbose_name = 'Opportunity'
        verbose_name_plural = 'Opportunities'

    def __str__(self):
        return f"{self.title} @ {self.company.company_name} ({self.opportunity_type})"


class OpportunitySkillRequirement(models.Model):
    """
    Required minimum skill scores specified for an opportunity.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='skill_requirements'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='opportunity_requirements'
    )
    minimum_score = models.PositiveIntegerField(default=70)
    weight = models.FloatField(default=1.0)
    is_required = models.BooleanField(default=True)

    class Meta:
        app_label = 'companies'
        verbose_name = 'Opportunity Skill Requirement'
        verbose_name_plural = 'Opportunity Skill Requirements'
        constraints = [
            models.UniqueConstraint(
                fields=['opportunity', 'skill'],
                name='unique_opportunity_skill'
            )
        ]

    def __str__(self):
        return f"{self.opportunity.title} -> {self.skill.name} (Min: {self.minimum_score}%)"


class OpportunityMatch(models.Model):
    """
    Calculated compatibility match between a Student and an Opportunity.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.CASCADE,
        related_name='opportunity_matches'
    )
    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='matches'
    )
    match_score = models.FloatField(default=0.0)
    skill_match_score = models.FloatField(default=0.0)
    calculated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'companies'
        ordering = ['-match_score']
        verbose_name = 'Opportunity Match'
        verbose_name_plural = 'Opportunity Matches'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'opportunity'],
                name='unique_student_opportunity_match'
            )
        ]

    def __str__(self):
        return f"{self.student.user.email} -> {self.opportunity.title}: {self.match_score}% Match"


class ApplicationStatus(models.TextChoices):
    APPLIED = 'applied', 'Applied'
    UNDER_REVIEW = 'under_review', 'Under Review'
    SHORTLISTED = 'shortlisted', 'Shortlisted'
    INTERVIEW = 'interview', 'Interview'
    SELECTED = 'selected', 'Selected'
    REJECTED = 'rejected', 'Rejected'
    WITHDRAWN = 'withdrawn', 'Withdrawn'


class Application(models.Model):
    """
    Application submitted by a Student for an Opportunity.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.CASCADE,
        related_name='applications'
    )
    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    resume = models.FileField(upload_to='application_resumes/', null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    status = models.CharField(
        max_length=50,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED
    )
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'companies'
        ordering = ['-applied_at']
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'opportunity'],
                name='unique_student_opportunity_application'
            )
        ]

    def __str__(self):
        return f"{self.student.user.email} -> {self.opportunity.title} [{self.status}]"


class ApplicationStatusHistory(models.Model):
    """
    Audit log of status updates for an application.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    old_status = models.CharField(max_length=50, blank=True)
    new_status = models.CharField(max_length=50)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'companies'
        ordering = ['-created_at']
        verbose_name = 'Application Status History'
        verbose_name_plural = 'Application Status Histories'

    def __str__(self):
        return f"Application #{self.application.id}: {self.old_status} -> {self.new_status}"


