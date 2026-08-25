import uuid
from django.db import models


class Institution(models.Model):
    """
    Model representing an educational institution.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, db_index=True)
    website = models.URLField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='India')
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'institutions'
        ordering = ['name']
        verbose_name = 'Institution'
        verbose_name_plural = 'Institutions'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        try:
            for ap in self.academicians.select_related('user').all():
                if ap.user and ap.user.is_verified != self.is_verified:
                    ap.user.is_verified = self.is_verified
                    ap.user.save(update_fields=['is_verified'])
        except Exception:
            pass

    def __str__(self):
        return f"{self.name} ({self.city})"
