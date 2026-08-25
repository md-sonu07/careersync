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
    profile_picture = serializers.CharField(required=False, allow_blank=True, allow_null=True)

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
        user = User.objects.create_user(password=password, **validated_data)
        if profile_pic:
            user.profile_picture = profile_pic
            user.save(update_fields=['profile_picture'])
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

