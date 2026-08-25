from django.urls import path
from companies.views import (
    CompanyProfileView,
    AdminVerificationListView,
    AdminVerificationActionView,
)

urlpatterns = [
    path('profile/', CompanyProfileView.as_view(), name='company_profile'),
    path('verifications/', AdminVerificationListView.as_view(), name='admin_verifications'),
    path('verifications/<str:pk>/action/', AdminVerificationActionView.as_view(), name='admin_verification_action'),
]
