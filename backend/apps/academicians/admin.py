from django.contrib import admin
from academicians.models import AcademicianProfile


@admin.register(AcademicianProfile)
class AcademicianProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'designation', 'department', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'department', 'designation')
    list_filter = ('department', 'institution')
    ordering = ('-created_at',)
