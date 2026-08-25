from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import (
    UserRegistrationSerializer,
    UserResponseSerializer,
    CustomTokenObtainPairSerializer,
)


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Register a new user (Student, Industry, or Academician) and return JWT tokens.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens for immediate login after registration
        refresh = RefreshToken.for_user(user)

        user_data = UserResponseSerializer(user).data
        return Response({
            "message": "User registered successfully",
            "user": user_data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Login with email and password to receive JWT tokens and user profile.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/auth/me/
    PATCH /api/auth/me/
    Retrieve or update currently authenticated user information.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserResponseSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Logout authenticated user by blacklisting their refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )


from accounts.permissions import IsAdmin
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class UserListView(generics.ListAPIView):
    """
    GET /api/auth/users/ -> List all registered platform users for Admin
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    serializer_class = UserResponseSerializer

    def get_queryset(self):
        qs = User.objects.all().order_by('-created_at')
        role = self.request.query_params.get('role')
        search = self.request.query_params.get('search')

        if role and role.lower() != 'all':
            qs = qs.filter(role__iexact=role.lower())
        if search:
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        return qs


class ToggleUserActiveView(APIView):
    """
    PATCH /api/auth/users/<uuid:pk>/toggle-active/ -> Block or unblock a user
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save(update_fields=['is_active'])
            return Response(UserResponseSerializer(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
