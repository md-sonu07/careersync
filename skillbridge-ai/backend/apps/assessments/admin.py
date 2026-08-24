from django.contrib import admin
from assessments.models import (
    Assessment,
    Question,
    QuestionOption,
    AssessmentAttempt,
    StudentAnswer,
)


class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 4


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'skill', 'difficulty', 'time_limit', 'total_marks', 'is_active', 'created_at')
    list_filter = ('difficulty', 'is_active', 'skill')
    search_fields = ('title', 'description')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'assessment', 'difficulty', 'is_ai_generated', 'created_at')
    list_filter = ('difficulty', 'is_ai_generated', 'assessment')
    search_fields = ('question_text', 'explanation')
    inlines = [QuestionOptionInline]


@admin.register(AssessmentAttempt)
class AssessmentAttemptAdmin(admin.ModelAdmin):
    list_display = ('student', 'assessment', 'score', 'percentage', 'status', 'started_at', 'completed_at')
    list_filter = ('status', 'assessment')
    search_fields = ('student__user__email', 'assessment__title')


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'selected_option', 'is_correct', 'answered_at')
    list_filter = ('is_correct',)
