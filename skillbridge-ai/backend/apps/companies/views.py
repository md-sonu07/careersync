from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404

from accounts.permissions import IsIndustry, IsCompanyOwner, IsStudent
from students.models import StudentProfile
from companies.models import (
    Company,
    Opportunity,
    OpportunityMatch,
    Application,
    ApplicationStatusHistory,
    ApplicationStatus,
)
from companies.serializers import (
    CompanySerializer,
    OpportunitySerializer,
    OpportunityCreateUpdateSerializer,
    OpportunityMatchSerializer,
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationStatusUpdateSerializer,
)
from companies.services.matching_engine import calculate_opportunity_matches_for_student


class CompanyProfileView(APIView):
    """
    GET   /api/companies/profile/ -> Get authenticated company profile
    PATCH /api/companies/profile/ -> Update company profile
    """
    permission_classes = [permissions.IsAuthenticated, IsIndustry]

    def get(self, request):
        company, _ = Company.objects.get_or_create(
            user=request.user,
            defaults={'company_name': request.user.first_name or request.user.email.split('@')[0]}
        )
        serializer = CompanySerializer(company)
        return Response(serializer.data)

    def patch(self, request):
        company, _ = Company.objects.get_or_create(
            user=request.user,
            defaults={'company_name': request.user.first_name or request.user.email.split('@')[0]}
        )
        serializer = CompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class OpportunityListCreateView(APIView):
    """
    GET  /api/opportunities/ -> List all published opportunities (filterable by ?type=, ?work_mode=, ?search=)
    POST /api/opportunities/ -> Create a new opportunity (Industry role only)
    """
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsIndustry()]
        return [permissions.AllowAny()]

    def get(self, request):
        queryset = Opportunity.objects.filter(status='published')
        opp_type = request.query_params.get('type')
        work_mode = request.query_params.get('work_mode')
        search = request.query_params.get('search')

        if opp_type:
            queryset = queryset.filter(opportunity_type__iexact=opp_type)
        if work_mode:
            queryset = queryset.filter(work_mode__iexact=work_mode)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(company__company_name__icontains=search)
            )

        serializer = OpportunitySerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        company, _ = Company.objects.get_or_create(
            user=request.user,
            defaults={'company_name': request.user.first_name or request.user.email.split('@')[0]}
        )
        serializer = OpportunityCreateUpdateSerializer(data=request.data, context={'company': company})
        serializer.is_valid(raise_exception=True)
        opportunity = serializer.save()

        response_serializer = OpportunitySerializer(opportunity)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OpportunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/opportunities/{id}/ -> Retrieve opportunity details & requirements
    PATCH  /api/opportunities/{id}/ -> Update opportunity (Owning company only)
    DELETE /api/opportunities/{id}/ -> Delete opportunity (Owning company only)
    """
    queryset = Opportunity.objects.all()
    lookup_field = 'pk'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsIndustry(), IsCompanyOwner()]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OpportunityCreateUpdateSerializer
        return OpportunitySerializer


class OpportunityMatchListView(generics.ListAPIView):
    """
    GET /api/opportunities/matches/ -> Personalized opportunity matches for student (sorted by -match_score)
    """
    serializer_class = OpportunityMatchSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return calculate_opportunity_matches_for_student(student)


class OpportunityMatchRecalculateView(APIView):
    """
    POST /api/opportunities/matches/recalculate/ -> Force recalculating opportunity matches for student
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request):
        student, _ = StudentProfile.objects.get_or_create(user=request.user)
        matches = calculate_opportunity_matches_for_student(student)
        serializer = OpportunityMatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OpportunityApplyView(APIView):
    """
    POST /api/opportunities/{id}/apply/ -> Student submits job/internship application
    """
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        student, _ = StudentProfile.objects.get_or_create(user=request.user)

        if Application.objects.filter(student=student, opportunity=opportunity).exists():
            return Response(
                {"detail": "You have already applied for this opportunity."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ApplicationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        application = Application.objects.create(
            student=student,
            opportunity=opportunity,
            cover_letter=serializer.validated_data.get('cover_letter', ''),
            resume=serializer.validated_data.get('resume', None),
            status=ApplicationStatus.APPLIED
        )

        ApplicationStatusHistory.objects.create(
            application=application,
            old_status='',
            new_status=ApplicationStatus.APPLIED,
            changed_by=request.user,
            remarks='Application submitted.'
        )

        response_serializer = ApplicationSerializer(application)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class StudentApplicationListView(generics.ListAPIView):
    """
    GET /api/applications/my/ -> List all applications submitted by student
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return Application.objects.filter(student=student)


class CompanyApplicationListView(generics.ListAPIView):
    """
    GET /api/company/applications/ -> List all applications received for company's opportunities
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsIndustry]

    def get_queryset(self):
        company, _ = Company.objects.get_or_create(
            user=self.request.user,
            defaults={'company_name': self.request.user.first_name or self.request.user.email.split('@')[0]}
        )
        return Application.objects.filter(opportunity__company=company)


class ApplicationStatusUpdateView(APIView):
    """
    PATCH /api/applications/{id}/status/ -> Company recruiter updates application status
    """
    permission_classes = [permissions.IsAuthenticated, IsIndustry]

    def patch(self, request, pk):
        company, _ = Company.objects.get_or_create(
            user=request.user,
            defaults={'company_name': request.user.first_name or request.user.email.split('@')[0]}
        )
        application = get_object_or_404(Application, pk=pk, opportunity__company=company)

        serializer = ApplicationStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        remarks = serializer.validated_data.get('remarks', '')
        old_status = application.status

        if old_status != new_status:
            application.status = new_status
            application.save()

            ApplicationStatusHistory.objects.create(
                application=application,
                old_status=old_status,
                new_status=new_status,
                changed_by=request.user,
                remarks=remarks
            )

        response_serializer = ApplicationSerializer(application)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
