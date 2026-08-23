import uuid
from django.db import models
from django.conf import settings


class CompanySize(models.TextChoices):
    MICRO = '1-10', '1-10 employees'
    SMALL = '11-50', '11-50 employees'
    MEDIUM = '51-200', '51-200 employees'
    LARGE = '201-500', '201-500 employees'
    ENTERPRISE = '500+', '500+ employees'


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
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
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
