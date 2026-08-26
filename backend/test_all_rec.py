from django.contrib.auth import get_user_model
from courses.services.recommendation_engine import generate_learning_recommendations
from students.models import StudentProfile
import traceback

User = get_user_model()
for user in User.objects.filter(role='student'):
    student, _ = StudentProfile.objects.get_or_create(user=user)
    try:
        generate_learning_recommendations(student)
    except Exception as e:
        print(f'User {user.email} crashed!')
        traceback.print_exc()
print('All users checked for recommendations.')

