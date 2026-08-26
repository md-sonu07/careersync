from django.contrib.auth import get_user_model
from students.models import StudentProfile
from skills.models import CareerRole
from skills.services.gap_engine import calculate_student_skill_gaps
User = get_user_model()
user = User.objects.filter(role='student').first()
if user:
    student, _ = StudentProfile.objects.get_or_create(user=user)
    try:
        calculate_student_skill_gaps(student)
        print('calculate_student_skill_gaps succeeded')
    except Exception as e:
        import traceback
        traceback.print_exc()
else:
    print('No student user found')

