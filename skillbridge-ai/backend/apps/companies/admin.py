from django.contrib import admin
from companies.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'industry_type', 'company_size', 'is_verified', 'created_at')
    list_filter = ('company_size', 'is_verified', 'industry_type')
    search_fields = ('company_name', 'official_email', 'user__email')
    ordering = ('company_name',)
