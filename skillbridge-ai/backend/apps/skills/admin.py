from django.contrib import admin
from skills.models import Skill, CareerRole, CareerSkillRequirement, StudentSkill, SkillScoreHistory


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')


class CareerSkillRequirementInline(admin.TabularInline):
    model = CareerSkillRequirement
    extra = 1


@admin.register(CareerRole)
class CareerRoleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')
    inlines = [CareerSkillRequirementInline]


@admin.register(StudentSkill)
class StudentSkillAdmin(admin.ModelAdmin):
    list_display = ('student', 'skill', 'score', 'level', 'source', 'is_verified', 'updated_at')
    list_filter = ('level', 'source', 'is_verified', 'skill__category')
    search_fields = ('student__user__email', 'skill__name')


@admin.register(SkillScoreHistory)
class SkillScoreHistoryAdmin(admin.ModelAdmin):
    list_display = ('student', 'skill', 'score', 'source', 'recorded_at')
    list_filter = ('source', 'recorded_at')
    search_fields = ('student__user__email', 'skill__name')
