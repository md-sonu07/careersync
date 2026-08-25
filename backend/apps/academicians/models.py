import uuid
from django.db import models
from django.conf import settings
from institutions.models import Institution


class AcademicianProfile(models.Model):
    """
    Profile model for Academician / Faculty users.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='academician_profile'
    )
    institution = models.ForeignKey(
        Institution,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='academicians'
    )
    designation = models.CharField(max_length=150, blank=True)
    department = models.CharField(max_length=150, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'academicians'
        ordering = ['-created_at']
        verbose_name = 'Academician Profile'
        verbose_name_plural = 'Academician Profiles'

    def __str__(self):
        return f"Academician: {self.user.full_name} ({self.designation})"
