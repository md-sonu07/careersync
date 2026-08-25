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
        logo_input = request.data.get('logo') or request.data.get('profile_picture')
        if logo_input:
            request.user.profile_picture = logo_input
            request.user.save(update_fields=['profile_picture'])
            company.logo = logo_input
            company.save(update_fields=['logo'])

        serializer = CompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CompanySerializer(company).data)


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
        if request.user.is_authenticated and request.query_params.get('my_posts') == 'true':
            queryset = Opportunity.objects.filter(company__user=request.user)
        else:
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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            student, _ = StudentProfile.objects.get_or_create(user=self.request.user)
            return calculate_opportunity_matches_for_student(student)
        except Exception:
            return OpportunityMatch.objects.none()


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


from accounts.permissions import IsAdmin
from institutions.models import Institution
from accounts.models import User, UserRole


class AdminVerificationListView(APIView):
    """
    GET /api/companies/verifications/ -> List all company & college verification records for Admin
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        companies = Company.objects.all()
        institutions = Institution.objects.all()

        results = []
        for c in companies:
            results.append({
                "id": str(c.id),
                "name": c.company_name,
                "type": "Company",
                "docs": "Incorporation.pdf, GST.pdf",
                "date": c.created_at.strftime('%Y-%m-%d') if c.created_at else '2026-02-10',
                "reviewer": "System Admin" if c.is_verified else "—",
                "reason": "—",
                "is_verified": c.is_verified,
                "entity_type": "company",
            })

        for inst in institutions:
            results.append({
                "id": str(inst.id),
                "name": inst.name,
                "type": "College",
                "docs": "Affiliation.pdf, UGC.pdf",
                "date": inst.created_at.strftime('%Y-%m-%d') if inst.created_at else '2026-02-11',
                "reviewer": "System Admin" if inst.is_verified else "—",
                "reason": "—",
                "is_verified": inst.is_verified,
                "entity_type": "institution",
            })

        return Response(results, status=status.HTTP_200_OK)


class AdminVerificationActionView(APIView):
    """
    POST /api/companies/verifications/<str:pk>/action/ -> Admin verifies or rejects an entity
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        action_type = request.data.get('action')
        reason = request.data.get('reason', '')

        try:
            company = Company.objects.get(pk=pk)
            company.is_verified = (action_type == 'verify')
            company.save(update_fields=['is_verified'])
            if company.user:
                company.user.is_verified = (action_type == 'verify')
                company.user.save(update_fields=['is_verified'])
            return Response({"message": f"Company {action_type}ed successfully.", "is_verified": company.is_verified})
        except Company.DoesNotExist:
            pass

        try:
            inst = Institution.objects.get(pk=pk)
            inst.is_verified = (action_type == 'verify')
            inst.save(update_fields=['is_verified'])
            for ap in inst.academicians.all():
                if ap.user:
                    ap.user.is_verified = (action_type == 'verify')
                    ap.user.save(update_fields=['is_verified'])
            return Response({"message": f"Institution {action_type}ed successfully.", "is_verified": inst.is_verified})
        except Institution.DoesNotExist:
            pass

        return Response({"error": "Entity not found."}, status=status.HTTP_404_NOT_FOUND)
