from django.contrib.auth import get_user_model
from courses.services.recommendation_engine import generate_learning_recommendations
from students.models import StudentProfile
import traceback
User = get_user_model()
user = User.objects.filter(role='student').first()
if user:
    student = StudentProfile.objects.get(user=user)
    try:
        generate_learning_recommendations(student)
        print('generate_learning_recommendations succeeded')
    except Exception as e:
        traceback.print_exc()
else:
    print('User not found')

