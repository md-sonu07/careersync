from django.contrib import admin
from companies.models import Company, Opportunity, OpportunitySkillRequirement


class OpportunitySkillRequirementInline(admin.TabularInline):
    model = OpportunitySkillRequirement
    extra = 2


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'official_email', 'industry_type', 'company_size', 'is_verified', 'created_at')
    list_filter = ('company_size', 'is_verified', 'industry_type')
    search_fields = ('company_name', 'official_email')


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'opportunity_type', 'work_mode', 'location', 'stipend_salary', 'status', 'created_at')
    list_filter = ('opportunity_type', 'work_mode', 'status', 'company')
    search_fields = ('title', 'description', 'company__company_name')
    inlines = [OpportunitySkillRequirementInline]
