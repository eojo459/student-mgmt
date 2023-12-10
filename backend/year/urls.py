from django.urls import path
from .views import AcademicYears, CurrentYear, FinishYear, ActiveYears

urlpatterns = [
    path('all/', AcademicYears.as_view(), name='academicyear'),
    path('current/', CurrentYear.as_view(), name='currentacademicyear'),
    path('current/finish/', FinishYear.as_view(), name='finishacademicyear'),
    path('active/', ActiveYears.as_view(), name='activeacademicyears'),
]