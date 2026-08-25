from rest_framework import generics, permissions
from institutions.models import Institution
from institutions.serializers import InstitutionSerializer


class InstitutionListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/institutions/ -> List all institutions
    POST /api/institutions/ -> Create a new institution
    """
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ['name', 'city', 'state']


class InstitutionDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/institutions/{id}/ -> Retrieve institution details
    PATCH /api/institutions/{id}/ -> Update institution
    """
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
