from django.urls import path
from institutions.views import InstitutionListCreateView, InstitutionDetailView

urlpatterns = [
    path('', InstitutionListCreateView.as_view(), name='institution_list_create'),
    path('<uuid:pk>/', InstitutionDetailView.as_view(), name='institution_detail'),
]
