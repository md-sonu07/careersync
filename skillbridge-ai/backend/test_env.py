import os
import django
from decouple import config

print("AI_PROVIDER in decouple:", config('AI_PROVIDER', default='mock'))
print("API_KEY in decouple:", config('GEMINI_API_KEY', default='missing'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
print("Settings AI_PROVIDER:", getattr(settings, 'AI_PROVIDER', 'not found'))
