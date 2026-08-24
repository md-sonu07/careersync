import os
import django
from decouple import config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.ai.services.providers import get_ai_provider

provider = get_ai_provider()
print("Provider class:", provider.__class__.__name__)
print("Model name:", provider.get_model_name())

try:
    res = provider.generate([{'role': 'user', 'content': 'Say "Hello, world!" in exactly two words.'}])
    print("Response:", res['message'])
except Exception as e:
    import traceback
    traceback.print_exc()
