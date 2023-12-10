from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import calendar
from .serializers import calendarSerializer
from django.contrib.auth.models import AnonymousUser
from user.models import User
class calendarModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.calendar= calendar.objects.create(
            academicYear="2025",
            startDate="2024-01-27",
            numWorkDays="35",
        )
    def test_get_calendar_info_unauthorized(self):
            self.client.force_authenticate(user=AnonymousUser())
            response = self.client.get('/api/calendars/calendar/')
            self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
            self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})
    def test_get_course_info_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/calendars/calendar/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    def test_post_calendar_info_unauthorized(self):
            self.client.force_authenticate(user=AnonymousUser())
            response = self.client.post('/api/calendars/calendar/')
            self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
            self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})


    def test_post_calendar_info_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        data={
            "academicYear":"2024",
            "startDate":"2024-01-27",
            "numWorkDays":"35",
            "holiday": "2024-02-03"
        }
        response = self.client.post('/api/calendars/calendar/',data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)


class exactCalendarModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.calendar= calendar.objects.create(
            academicYear="2025",
            startDate="2024-01-27",
            numWorkDays="35",
        )
    def test_get_calendar_info_unauthorized(self):
            self.client.force_authenticate(user=AnonymousUser())
            response = self.client.get('/api/calendars/calendar/2025')
            self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
            self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})

    def test_get_calendar_info_authorized(self):
        user = User.objects.create_user(username='testadmin',email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/calendars/calendar/2025')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

class calendarGeneratorModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        data={
            "academicYear":"2025",
            "startDate":"2024-01-27",
            "numWorkDays":"35",
            "holiday": "2024-02-03"
        }
        response = self.client.post('/api/calendars/calendar/',data)
    def test_patch_calendar_info_unauthorized(self):
            self.client.force_authenticate(user=AnonymousUser())
            response = self.client.patch('/api/calendars/calendar/generator')
            self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
            self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})
                                        