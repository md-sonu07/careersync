from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from accounts.models import UserRole

User = get_user_model()


class UserResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for exposing User profile details.
    """
    full_name = serializers.CharField(read_only=True)
    profile_picture = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_verified = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'role',
            'profile_picture',
            'is_active',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'email', 'is_active', 'is_verified', 'created_at', 'updated_at']

    def get_is_verified(self, obj):
        if getattr(obj, 'is_verified', False):
            return True
        if obj.role == UserRole.ACADEMICIAN and hasattr(obj, 'academician_profile'):
            inst = getattr(obj.academician_profile, 'institution', None)
            if inst and inst.is_verified:
                return True
        elif obj.role == UserRole.INDUSTRY and hasattr(obj, 'company_profile'):
            comp = obj.company_profile
            if comp and comp.is_verified:
                return True
        return False


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    first_name = serializers.CharField(required=False, allow_blank=True, default='')
    last_name = serializers.CharField(required=False, allow_blank=True, default='')
    profile_picture = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    institution_id = serializers.UUIDField(required=False, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'role',
            'password',
            'confirm_password',
            'profile_picture',
            'institution_id',
            'phone',
        ]

    def validate_role(self, value):
        val = str(value).lower()
        allowed_roles = [UserRole.STUDENT, UserRole.INDUSTRY, UserRole.ACADEMICIAN]
        if val not in allowed_roles:
            raise serializers.ValidationError("Invalid role for self-registration.")
        return val

    def validate_email(self, value):
        normalized_email = value.lower()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized_email

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        profile_pic = validated_data.pop('profile_picture', None)
        inst_id = validated_data.pop('institution_id', None)
        student_phone = validated_data.pop('phone', '')

        user = User.objects.create_user(password=password, **validated_data)
        if profile_pic:
            user.profile_picture = profile_pic
            user.save(update_fields=['profile_picture'])

        if user.role == UserRole.STUDENT:
            from students.models import StudentProfile
            from institutions.models import Institution
            inst_obj = None
            if inst_id:
                try:
                    inst_obj = Institution.objects.get(id=inst_id)
                except Exception:
                    inst_obj = None
            StudentProfile.objects.get_or_create(
                user=user,
                defaults={
                    'phone': student_phone,
                    'institution': inst_obj
                }
            )
        elif user.role == UserRole.ACADEMICIAN:
            from academicians.models import AcademicianProfile
            from institutions.models import Institution
            inst_name = f"{user.first_name} {user.last_name}".strip() or "Institute"
            inst, _ = Institution.objects.get_or_create(
                name=inst_name,
                defaults={'is_verified': False}
            )
            AcademicianProfile.objects.get_or_create(
                user=user,
                defaults={'institution': inst}
            )
        elif user.role == UserRole.INDUSTRY:
            from companies.models import Company
            comp_name = f"{user.first_name} {user.last_name}".strip() or "Company"
            Company.objects.get_or_create(
                user=user,
                defaults={
                    'company_name': comp_name,
                    'official_email': user.email,
                    'is_verified': False
                }
            )

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT Token Serializer that returns user profile info along with access & refresh tokens.
    """
    def validate(self, attrs):
        username_field = self.username_field
        if username_field in attrs and isinstance(attrs[username_field], str):
            attrs[username_field] = attrs[username_field].strip().lower()
        data = super().validate(attrs)
        data['user'] = UserResponseSerializer(self.user).data
        return data

