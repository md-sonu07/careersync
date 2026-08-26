from django.contrib.auth import get_user_model
from courses.services.course_recommender import get_course_recommendations
from students.models import StudentProfile
User = get_user_model()
user = User.objects.filter(role='student').first()
if user:
    student = StudentProfile.objects.get(user=user)
    try:
        get_course_recommendations(student)
        print('get_course_recommendations succeeded')
    except Exception as e:
        import traceback
        traceback.print_exc()

