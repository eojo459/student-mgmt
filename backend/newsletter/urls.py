from django.urls import path
from . import views

urlpatterns = [
    path('newsletters/', views.newsletter_list, name='newsletter_list'),
    path('newsletters/<int:pk>/', views.newsletter_detail, name='newsletter_detail'),
    path('newsletters/latest/', views.LatestNewsLetter, name='LatestNewsLetter'),
]