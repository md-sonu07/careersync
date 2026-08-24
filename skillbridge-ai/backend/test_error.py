import os
import django
from decouple import config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.ai.services import chat_service
from django.contrib.auth import get_user_model
from apps.ai.models import AIConversation

User = get_user_model()
user = User.objects.first()
conv = AIConversation.objects.create(user=user, title='Test')

try:
    print(chat_service.generate_response(conv, "hello", user))
except Exception as e:
    import traceback
    traceback.print_exc()
