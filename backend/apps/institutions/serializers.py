from rest_framework import serializers
from institutions.models import Institution


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            'id',
            'name',
            'institution_type',
            'website',
            'city',
            'state',
            'country',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']
