from rest_framework import serializers
from skills.serializers import SkillSerializer
from courses.models import LearningResource, LearningRecommendation


class LearningResourceSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)

    class Meta:
        model = LearningResource
        fields = [
            'id',
            'title',
            'description',
            'skill',
            'level',
            'resource_type',
            'content_url',
            'duration_minutes',
            'is_active',
            'created_at'
        ]


class LearningRecommendationSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    resource = LearningResourceSerializer(read_only=True)

    class Meta:
        model = LearningRecommendation
        fields = [
            'id',
            'skill',
            'resource',
            'priority',
            'status',
            'recommended_reason',
            'created_at'
        ]


class LearningRecommendationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningRecommendation
        fields = ['status']
