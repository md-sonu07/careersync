from django.urls import path
from academicians.views import AcademicianProfileView

urlpatterns = [
    path('profile/', AcademicianProfileView.as_view(), name='academician_profile'),
]
