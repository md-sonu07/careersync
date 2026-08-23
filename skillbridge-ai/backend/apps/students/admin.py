from django.contrib import admin
from students.models import StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'specialization', 'semester', 'graduation_year', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'course', 'enrollment_number')
    list_filter = ('course', 'graduation_year', 'semester')
    ordering = ('-created_at',)
