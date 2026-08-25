from rest_framework import serializers
from academicians.models import AcademicianProfile
from institutions.serializers import InstitutionSerializer
from accounts.serializers import UserResponseSerializer


class AcademicianProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Academician profiles with editable institution details.
    """
    user = UserResponseSerializer(read_only=True)
    institution_detail = InstitutionSerializer(source='institution', read_only=True)
    institution_name = serializers.CharField(source='institution.name', required=False)
    website = serializers.CharField(source='institution.website', required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(source='institution.city', required=False, allow_blank=True)
    state = serializers.CharField(source='institution.state', required=False, allow_blank=True)
    country = serializers.CharField(source='institution.country', required=False, allow_blank=True)

    class Meta:
        model = AcademicianProfile
        fields = [
            'id',
            'user',
            'institution',
            'institution_detail',
            'institution_name',
            'website',
            'city',
            'state',
            'country',
            'designation',
            'department',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        inst_data = validated_data.pop('institution', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if inst_data:
            inst = instance.institution
            if not inst:
                from institutions.models import Institution
                inst = Institution.objects.create(
                    name=inst_data.get('name') or instance.user.first_name or "Academic Institution",
                    website=inst_data.get('website', ''),
                    city=inst_data.get('city', ''),
                    state=inst_data.get('state', ''),
                    country=inst_data.get('country', 'India')
                )
                instance.institution = inst
                instance.save(update_fields=['institution'])
            else:
                for attr, value in inst_data.items():
                    setattr(inst, attr, value)
                inst.save()
        return instance
