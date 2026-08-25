from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    LogoutView,
    UserListView,
    ToggleUserActiveView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='auth_me'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('users/', UserListView.as_view(), name='admin_user_list'),
    path('users/<uuid:pk>/toggle-active/', ToggleUserActiveView.as_view(), name='admin_toggle_user_active'),
]
