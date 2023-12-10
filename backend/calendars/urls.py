from django.urls import path
from calendars import views as calendar_views

urlpatterns = [
    path('calendar/', calendar_views.calendarInfo, name='calendarinfo'),
    path('calendar/generator',calendar_views.calendarGenerator, name='calendarGenerator'),
    path('calendar/<int:academicYear>', calendar_views.exactCalendar, name='exactCalendar'),
    path('calendar/pdfGenerator', calendar_views.PDFGenerator, name='PDFGenerator'),
    path('calendar/<int:academicYear>/pdf', calendar_views.GetCalendarPDF, name='GetCalendarPDF'),
]