from rest_framework import serializers
from academicians.models import AcademicianProfile
from institutions.serializers import InstitutionSerializer
from accounts.serializers import UserResponseSerializer


class AcademicianProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Academician profiles.
    """
    user = UserResponseSerializer(read_only=True)
    institution_detail = InstitutionSerializer(source='institution', read_only=True)

    class Meta:
        model = AcademicianProfile
        fields = [
            'id',
            'user',
            'institution',
            'institution_detail',
            'designation',
            'department',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
