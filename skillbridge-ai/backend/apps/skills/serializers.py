from rest_framework import serializers
from skills.models import Skill, CareerRole, CareerSkillRequirement, StudentSkill, SkillScoreHistory


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description', 'is_active', 'created_at']


class CareerSkillRequirementSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = CareerSkillRequirement
        fields = ['id', 'skill', 'skill_id', 'required_score', 'weight', 'is_required']


class CareerRoleSerializer(serializers.ModelSerializer):
    skill_requirements = CareerSkillRequirementSerializer(many=True, read_only=True)

    class Meta:
        model = CareerRole
        fields = ['id', 'title', 'category', 'description', 'is_active', 'skill_requirements']


class StudentSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)

    class Meta:
        model = StudentSkill
        fields = [
            'id',
            'skill',
            'score',
            'level',
            'source',
            'last_assessed_at',
            'is_verified',
            'created_at',
            'updated_at'
        ]


class StudentSkillCreateSerializer(serializers.ModelSerializer):
    skill_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = StudentSkill
        fields = ['skill_id', 'score', 'level', 'source']

    def validate_skill_id(self, value):
        if not Skill.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Invalid or inactive skill ID.")
        return value

    def create(self, validated_data):
        student = self.context['student']
        skill_id = validated_data.pop('skill_id')
        skill = Skill.objects.get(id=skill_id)

        student_skill, created = StudentSkill.objects.update_or_create(
            student=student,
            skill=skill,
            defaults=validated_data
        )

        # Log history
        SkillScoreHistory.objects.create(
            student=student,
            skill=skill,
            score=student_skill.score,
            source=student_skill.source
        )

        return student_skill


class SkillScoreHistorySerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = SkillScoreHistory
        fields = ['id', 'skill', 'skill_name', 'score', 'source', 'recorded_at']
