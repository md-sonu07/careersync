"""
URL Configuration for CareerSync project.
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from config.views import health_check
from companies.views import (
    OpportunityListCreateView,
    OpportunityDetailView,
    OpportunityMatchListView,
    OpportunityMatchRecalculateView,
    OpportunityApplyView,
    StudentApplicationListView,
    CompanyApplicationListView,
    ApplicationStatusUpdateView,
)

# Swagger & OpenAPI Schema Configuration
schema_view = get_schema_view(
    openapi.Info(
        title="CareerSync REST API Specification",
        default_version='v1',
        description="Comprehensive REST API documentation for CareerSync — AI-Powered Skill Assessment, Skill Gap Engine, Learning Recommendations & Job Matching Platform.",
        terms_of_service="https://careersync.ai/terms/",
        contact=openapi.Contact(email="support@careersync.ai"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin & Health Check
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),

    # Core App Endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/institutions/', include('institutions.urls')),
    path('api/students/', include('students.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/academicians/', include('academicians.urls')),
    path('api/skills/', include('skills.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/opportunities/', OpportunityListCreateView.as_view(), name='opportunity_list_create'),
    path('api/opportunities/matches/', OpportunityMatchListView.as_view(), name='opportunity_match_list'),
    path('api/opportunities/matches/recalculate/', OpportunityMatchRecalculateView.as_view(), name='opportunity_match_recalculate'),
    path('api/opportunities/<uuid:pk>/', OpportunityDetailView.as_view(), name='opportunity_detail'),
    path('api/opportunities/<uuid:pk>/apply/', OpportunityApplyView.as_view(), name='opportunity_apply'),
    path('api/applications/my/', StudentApplicationListView.as_view(), name='student_applications'),
    path('api/company/applications/', CompanyApplicationListView.as_view(), name='company_applications'),
    path('api/applications/<uuid:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application_status_update'),
    path('api/analytics/', include('analytics.urls')),
    path('api/ai/', include('ai.urls', namespace='ai')),

    # Swagger & ReDoc Documentation Routes
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
