from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from skills.views import StudentSkillGapView
import traceback

User = get_user_model()
factory = APIRequestFactory()
view = StudentSkillGapView.as_view()

for user in User.objects.filter(role='student'):
    request = factory.get('/api/skills/gaps/')
    force_authenticate(request, user=user)
    try:
        response = view(request)
        if response.status_code == 500:
            print(f'User {user.email} got 500')
    except Exception as e:
        print(f'User {user.email} crashed!')
        traceback.print_exc()
print('All users tested.')

