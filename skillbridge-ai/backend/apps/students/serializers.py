from rest_framework import serializers
from students.models import StudentProfile
from institutions.serializers import InstitutionSerializer
from accounts.serializers import UserResponseSerializer


class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for reading and updating Student Profiles.
    """
    user = UserResponseSerializer(read_only=True)
    institution_detail = InstitutionSerializer(source='institution', read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'id',
            'user',
            'institution',
            'institution_detail',
            'enrollment_number',
            'course',
            'specialization',
            'semester',
            'graduation_year',
            'bio',
            'resume',
            'linkedin_url',
            'github_url',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
