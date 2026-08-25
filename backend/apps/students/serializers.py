from rest_framework import serializers
from students.models import StudentProfile
from institutions.models import Institution
from institutions.serializers import InstitutionSerializer
from accounts.serializers import UserResponseSerializer
from skills.serializers import StudentSkillSerializer


class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for reading and updating Student Profiles.
    """
    user = UserResponseSerializer(read_only=True)
    institution_detail = InstitutionSerializer(source='institution', read_only=True)
    institution_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    skills = StudentSkillSerializer(many=True, read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'id',
            'user',
            'institution',
            'institution_name',
            'institution_detail',
            'enrollment_number',
            'course',
            'specialization',
            'semester',
            'graduation_year',
            'bio',
            'career_goal',
            'skills',
            'resume',
            'linkedin_url',
            'github_url',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'skills', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        institution_name = validated_data.pop('institution_name', None)
        if institution_name:
            inst, _ = Institution.objects.get_or_create(
                name=institution_name.strip()
            )
            instance.institution = inst

        return super().update(instance, validated_data)
