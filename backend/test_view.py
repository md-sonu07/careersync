from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from skills.views import StudentSkillGapView
import traceback
User = get_user_model()
user = User.objects.filter(role='student').first()
if user:
    factory = APIRequestFactory()
    request = factory.get('/api/skills/gaps/')
    force_authenticate(request, user=user)
    view = StudentSkillGapView.as_view()
    try:
        response = view(request)
        print('StudentSkillGapView succeeded:', response.status_code)
    except Exception as e:
        traceback.print_exc()
else:
    print('User not found')

