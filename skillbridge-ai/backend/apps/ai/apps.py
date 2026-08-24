import os
from django.apps import AppConfig


class AiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ai'

    def ready(self):
        # Import services/signals here to avoid circular imports
        import ai.services.providers  # noqa: F401