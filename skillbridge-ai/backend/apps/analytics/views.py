from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsStudent, IsIndustry, IsAcademician
from students.models import StudentProfile
from companies.models import Company
from analytics.services.analytics_engine import (
    get_student_analytics,
    get_company_analytics,
    get_academician_analytics,
)


class StudentAnalyticsView(APIView):
    """
    GET /api/analytics/student/ -> Returns career readiness, skill progress, top skill gaps, assessment history
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        student, _ = StudentProfile.objects.get_or_create(user=request.user)
        data = get_student_analytics(student)
        return Response(data, status=status.HTTP_200_OK)


class CompanyAnalyticsView(APIView):
    """
    GET /api/analytics/company/ -> Returns active opportunities, total applications, shortlisted, top matches
    """
    permission_classes = [permissions.IsAuthenticated, IsIndustry]

    def get(self, request):
        company, _ = Company.objects.get_or_create(
            user=request.user,
            defaults={'company_name': request.user.first_name or request.user.email.split('@')[0]}
        )
        data = get_company_analytics(company)
        return Response(data, status=status.HTTP_200_OK)


class AcademicianAnalyticsView(APIView):
    """
    GET /api/analytics/academician/ -> Returns aggregated student skill scores, top skill gaps, readiness & placement stats
    """
    permission_classes = [permissions.IsAuthenticated, IsAcademician]

    def get(self, request):
        data = get_academician_analytics()
        return Response(data, status=status.HTTP_200_OK)
