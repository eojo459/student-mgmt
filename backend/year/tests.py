from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from .models import AcademicYear, CurrentAcademicYear
from .serializers import AcademicYearSerializer, CurrentAcademicYearSerializer
from students.models import Student, Mark
from course.models import Course
from user.models import Teacher

User = get_user_model()

class AcademicYearModelTest(TestCase):
    """Test the AcademicYear model"""

    def setUp(self):
        self.year = AcademicYear.objects.create(year=2023)

    def test_str(self):
        """Test the string representation of the AcademicYear model"""
        self.assertEqual(str(self.year), '2023')

class CurrentAcademicYearModelTest(TestCase):
    """Test the CurrentAcademicYear model"""

    def setUp(self):
        self.academic_year = AcademicYear.objects.create(year=2023)
        self.current_academic_year = CurrentAcademicYear.objects.create(academic_year=self.academic_year)

    def test_str(self):
        """Test the string representation of the CurrentAcademicYear model"""
        self.assertEqual(str(self.current_academic_year), '2023')

class AcademicYearViewTest(TestCase):
    """Test the AcademicYears view"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        self.admin_user.role = 'ADMIN'
        self.client.force_authenticate(user=self.admin_user)
        self.url = reverse('academicyear')

    def test_get_academic_years(self):
        """Test getting a list of all academic years"""
        AcademicYear.objects.create(year=2021)
        AcademicYear.objects.create(year=2022)
        response = self.client.get(self.url)
        academic_years = AcademicYear.objects.all()
        serializer = AcademicYearSerializer(academic_years, many=True)
        current_academic_year = CurrentAcademicYear.objects.first()
        current_academic_year_serializer = CurrentAcademicYearSerializer(current_academic_year)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['years'], serializer.data)
        self.assertEqual(response.data['current_year'], current_academic_year_serializer.data)

    def test_create_academic_year(self):
        """Test creating a new academic year"""
        data = {'year': 2024}
        response = self.client.post(self.url, data)
        academic_year = AcademicYear.objects.filter(year=2024)
        serializer = AcademicYearSerializer(academic_year, many=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, serializer.data[0])

    def test_create_academic_year_unauthenticated(self):
        """Test creating a new academic year when unauthenticated"""
        self.client.logout()
        data = {'year': 2024}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_academic_year_non_admin(self):
        """Test creating a new academic year when not an admin"""
        user = Teacher.objects.create_user(username='testuser', email='test@user.com', password='userpass')
        self.client.force_authenticate(user=user)
        data = {'year': 2024}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class CurrentAcademicYearViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        self.admin_user.role = "ADMIN"
        self.client.force_authenticate(user=self.admin_user)
        self.academic_year = AcademicYear.objects.create(year=2022)
        self.current_academic_year = CurrentAcademicYear.objects.create(academic_year=self.academic_year)

    def test_get_current_academic_year(self):
        """Test GET request on CurrentYear view"""
        response = self.client.get(reverse('currentacademicyear'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, CurrentAcademicYearSerializer(self.current_academic_year).data)


    def test_set_current_academic_year_without_permission(self):
        """Test POST request on CurrentYear view without permission"""
        self.admin_user.role = "TEACHER"
        self.admin_user.save()
        academic_year = AcademicYear.objects.create(year=2023)
        data = {'year': academic_year.id}
        response = self.client.post(reverse('currentacademicyear'), data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
