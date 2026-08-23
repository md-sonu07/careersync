from django.urls import path
from companies.views import CompanyProfileView

urlpatterns = [
    path('profile/', CompanyProfileView.as_view(), name='company_profile'),
]
