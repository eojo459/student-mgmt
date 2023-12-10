from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient
from students.models import Student
from user.models import User
from students.models import Mark, Student
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
import json
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from course.models import Course
class StudentInfoTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = Student.objects.create(
            firstName ='Test Student',
            lastName='Test Student',
            DoB ='2000-01-01',
            gender= 'Male',
            address= 'Test Address',
            foip=True
        )

    def test_get_student_info_unauthorized(self):
        response = self.client.get(reverse('studentinfo'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_student_info_get(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        response = self.client.get(reverse('studentinfo'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['studentId'], self.student.studentId)

    def test_post_student_info_unauthorized(self):
        response = self.client.post(reverse('studentinfo'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_student_info_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        data={
            "firstName":"Test Student",
            "lastName":"Test Student",
            "DoB" : "2000-01-01",
            "chineseName": "Test",
            "city":"test",
            "province":"test",
            "postalCode" :"A1A1A1",
            "medicalHistory": "test",
            "courses" : "1",
            "gender": "Female",
            "address": "Test Address",
            "foip":True,
        }
        response = self.client.post(reverse('studentinfo'),data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
class StudentDetailTestCase(TestCase):
        def setUp(self):
            self.client = APIClient()
            self.student = Student.objects.create(
                firstName ='Test Student',
                lastName='Test Student',
                DoB ='2000-01-01',
                gender= 'M',
                address= 'Test Address',
                foip=True,
                postalCode="A1A1A1"
            )
        def test_student_detail_unauthorized(self):
            response = self.client.get(reverse('studentDetail', kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        def test_student_detail_authorized(self):
            user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
            user.role="ADMIN"
            self.client.force_authenticate(user=user)
            response = self.client.get(reverse('studentDetail',kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        def test_student_detail_patch_unauthorized(self):
            response = self.client.patch(reverse('studentDetail', kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        def test_student_detail_patch_authorized(self):
            user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
            user.role="ADMIN"
            self.client.force_authenticate(user=user)
            data={
                    "firstName":"TestStudent1",
                    "lastName":"TestStudent2",
                    "postalCode":"A1A1A1",
            }
            response = self.client.patch(reverse('studentDetail', kwargs={'studentId': self.student.studentId}), data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, {"message":"Student modified"})

        def test_student_detail_delete_unauthorized(self):
            response = self.client.delete(reverse('studentDetail', kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        def test_student_detail_delete_authorized(self):
            user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
            user.role="ADMIN"
            self.client.force_authenticate(user=user)
            response = self.client.delete(reverse('studentDetail', kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

class StudentHistoryTestCase(TestCase):
        def setUp(self):
            self.client = APIClient()
            self.student = Student.objects.create(
                firstName ='Test Student',
                lastName='Test Student',
                DoB ='2000-01-01',
                gender= 'M',
                address= 'Test Address',
                foip=True
            )
            self.course= Course.objects.create(
            academicYear="2024",
            courseName="TestCourse",
            grade="2",
            courseLanguage="Mandarin",
        )
            self.Themark=Mark.objects.create(
                 courseId=self.course,
                 studentId=self.student,
                 mark="B",
            ) 
        
        def test_get_studentHistory_unauthorized(self):
            response = self.client.get(reverse('studentDetail', kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        def test_get_studentHistory_authorized(self):
            user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
            user.role="ADMIN"
            self.client.force_authenticate(user=user)
            response = self.client.get(reverse('studentHistory', kwargs={'studentId': self.student.studentId}))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

class StudentDetailViewTestCase(APITestCase):
    def setUp(self):
        self.student = Student.objects.create(
            firstName="John",
            lastName="Doe",
            chineseName="张三",
            address="123 Main St",
            city="Anytown",
            province="BC",
            postalCode="V1X 2Y3",
            DoB ='2000-01-01',
            gender="M",
            medicalHistory="None",
            remark="",
            foip=True,
            disabled=False
        )
        self.course= Course.objects.create(
            academicYear="2024",
            courseName="TestCourse",
            grade="2",
            courseLanguage="Mandarin",
        )
        self.mark = Mark.objects.create(
            courseId=self.course,
            studentId=self.student,
            mark=80,
            status="Enrolled",
            comment=""
        )
        self.valid_payload = {
            "mark": 90,
            "status": "Completed",
            "comment": "Good job"
        }
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', email='testuser@test.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_valid_patch_student_mark(self):
        response = self.client.patch(
            reverse('studentMark', kwargs={'studentId': self.student.studentId, 'markId': self.mark.id}),
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    def test_patch_student_mark_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.patch(
            reverse('studentMark', kwargs={'studentId': self.student.studentId, 'markId': self.mark.id}),
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_student_mark_authorized(self):
        user = User.objects.create_user(
            username='testuser2', email='testuser2@test.com', password='testpassword')
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            reverse('studentMark', kwargs={'studentId': self.student.studentId, 'markId': self.mark.id}),
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class StudentDisableViewTestCase(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
        username="admin", password="adminpassword", role="ADMIN")
        self.student = Student.objects.create(
            firstName="John",
            lastName="Doe",
            studentId=1,
            chineseName="张三",
            address="123 Main St",
            city="Calgary",
            province="Alberta",
            postalCode="T2P 2G9",
            DoB="2000-01-01",
            gender="Male",
            medicalHistory="None",
            remark="",
            foip=True,
        )
        self.url = reverse("studentDis", kwargs={"studentId": self.student.studentId})

    def test_student_disable_with_unauthenticated_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_disable_with_non_admin_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_disable_with_admin_user(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.disabled, True) 

    def test_student_enable_with_admin_user(self):
        self.student.disabled = True
        self.student.save()
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.disabled, False)


