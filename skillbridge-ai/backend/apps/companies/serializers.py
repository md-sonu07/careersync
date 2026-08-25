from rest_framework import serializers
from skills.serializers import SkillSerializer
from skills.models import Skill
from students.serializers import StudentProfileSerializer
from companies.models import (
    Company,
    Opportunity,
    OpportunitySkillRequirement,
    OpportunityMatch,
    Application,
    ApplicationStatusHistory,
)


class CompanySerializer(serializers.ModelSerializer):
    logo = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    profile_picture = serializers.CharField(source='user.profile_picture', read_only=True, required=False, allow_null=True)

    class Meta:
        model = Company
        fields = [
            'id',
            'company_name',
            'official_email',
            'website',
            'industry_type',
            'company_size',
            'description',
            'logo',
            'profile_picture',
            'is_verified',
            'created_at'
        ]


class OpportunitySkillRequirementSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = OpportunitySkillRequirement
        fields = ['id', 'skill', 'skill_id', 'minimum_score', 'weight', 'is_required']


class OpportunitySerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    skill_requirements = OpportunitySkillRequirementSerializer(many=True, read_only=True)
    applicants_count = serializers.SerializerMethodField()

    def get_applicants_count(self, obj):
        return obj.applications.count()

    class Meta:
        model = Opportunity
        fields = [
            'id',
            'company',
            'title',
            'opportunity_type',
            'description',
            'location',
            'work_mode',
            'duration',
            'stipend_salary',
            'deadline',
            'status',
            'skill_requirements',
            'applicants_count',
            'created_at',
            'updated_at'
        ]


class OpportunityCreateUpdateSerializer(serializers.ModelSerializer):
    skill_requirements = OpportunitySkillRequirementSerializer(many=True, required=False)

    class Meta:
        model = Opportunity
        fields = [
            'title',
            'opportunity_type',
            'description',
            'location',
            'work_mode',
            'duration',
            'stipend_salary',
            'deadline',
            'status',
            'skill_requirements'
        ]

    def create(self, validated_data):
        requirements_data = validated_data.pop('skill_requirements', [])
        company = self.context['company']
        opportunity = Opportunity.objects.create(company=company, **validated_data)

        for req_item in requirements_data:
            skill_id = req_item.pop('skill_id')
            skill = Skill.objects.get(id=skill_id)
            OpportunitySkillRequirement.objects.create(
                opportunity=opportunity,
                skill=skill,
                **req_item
            )

        return opportunity

    def update(self, instance, validated_data):
        requirements_data = validated_data.pop('skill_requirements', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if requirements_data is not None:
            instance.skill_requirements.all().delete()
            for req_item in requirements_data:
                skill_id = req_item.pop('skill_id')
                skill = Skill.objects.get(id=skill_id)
                OpportunitySkillRequirement.objects.create(
                    opportunity=instance,
                    skill=skill,
                    **req_item
                )

        return instance


class OpportunityMatchSerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)

    class Meta:
        model = OpportunityMatch
        fields = [
            'id',
            'opportunity',
            'match_score',
            'skill_match_score',
            'calculated_at'
        ]


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_email = serializers.ReadOnlyField(source='changed_by.email')

    class Meta:
        model = ApplicationStatusHistory
        fields = ['id', 'old_status', 'new_status', 'changed_by_email', 'remarks', 'created_at']


class ApplicationSerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)
    student = StudentProfileSerializer(read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'student',
            'opportunity',
            'resume',
            'cover_letter',
            'status',
            'status_history',
            'applied_at',
            'updated_at'
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['cover_letter', 'resume']


class ApplicationStatusUpdateSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=50)
    remarks = serializers.CharField(required=False, allow_blank=True)
