from rest_framework import serializers
from companies.models import Company
from accounts.serializers import UserResponseSerializer


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for Industry / Company profiles.
    """
    user = UserResponseSerializer(read_only=True)

    class Meta:
        model = Company
        fields = [
            'id',
            'user',
            'company_name',
            'official_email',
            'website',
            'industry_type',
            'company_size',
            'description',
            'logo',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'is_verified', 'created_at', 'updated_at']
