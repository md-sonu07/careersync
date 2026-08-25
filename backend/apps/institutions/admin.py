from django.contrib import admin
from institutions.models import Institution


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'institution_type', 'city', 'state', 'country', 'is_verified', 'created_at')
    list_filter = ('institution_type', 'is_verified', 'state', 'country')
    search_fields = ('name', 'city', 'state')
    ordering = ('name',)
