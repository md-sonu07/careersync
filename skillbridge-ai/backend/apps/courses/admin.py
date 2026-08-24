from django.contrib import admin
from courses.models import LearningResource, LearningRecommendation


@admin.register(LearningResource)
class LearningResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'skill', 'level', 'resource_type', 'duration_minutes', 'is_active', 'created_at')
    list_filter = ('level', 'resource_type', 'is_active', 'skill')
    search_fields = ('title', 'description')


@admin.register(LearningRecommendation)
class LearningRecommendationAdmin(admin.ModelAdmin):
    list_display = ('student', 'resource', 'priority', 'status', 'created_at')
    list_filter = ('priority', 'status')
    search_fields = ('student__user__email', 'resource__title', 'recommended_reason')
