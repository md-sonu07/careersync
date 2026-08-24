from rest_framework import serializers
from skills.serializers import SkillSerializer
from assessments.models import (
    Assessment,
    Question,
    QuestionOption,
    AssessmentAttempt,
    StudentAnswer,
)


class QuestionOptionStudentSerializer(serializers.ModelSerializer):
    """
    CRITICAL SECURITY RULE: Never expose `is_correct` field to students!
    """
    class Meta:
        model = QuestionOption
        fields = ['id', 'option_text']


class QuestionStudentSerializer(serializers.ModelSerializer):
    options = QuestionOptionStudentSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'difficulty', 'options']


class AssessmentListSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Assessment
        fields = [
            'id',
            'title',
            'description',
            'skill',
            'difficulty',
            'time_limit',
            'total_marks',
            'question_count',
            'is_active',
            'created_at'
        ]


class AssessmentDetailSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    questions = QuestionStudentSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = [
            'id',
            'title',
            'description',
            'skill',
            'difficulty',
            'time_limit',
            'total_marks',
            'questions',
            'is_active',
            'created_at'
        ]


class StudentAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    explanation = serializers.CharField(source='question.explanation', read_only=True)
    selected_option_text = serializers.CharField(source='selected_option.option_text', read_only=True)

    class Meta:
        model = StudentAnswer
        fields = [
            'id',
            'question',
            'question_text',
            'selected_option',
            'selected_option_text',
            'is_correct',
            'explanation',
            'answered_at'
        ]


class AssessmentAttemptSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(source='assessment.title', read_only=True)
    skill_name = serializers.CharField(source='assessment.skill.name', read_only=True)
    answers = StudentAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentAttempt
        fields = [
            'id',
            'assessment',
            'assessment_title',
            'skill_name',
            'score',
            'percentage',
            'status',
            'started_at',
            'completed_at',
            'answers'
        ]


class SubmitAnswerItemSerializer(serializers.Serializer):
    question_id = serializers.UUIDField()
    selected_option_id = serializers.UUIDField()


class SubmitAssessmentSerializer(serializers.Serializer):
    answers = SubmitAnswerItemSerializer(many=True)
