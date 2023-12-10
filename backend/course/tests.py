from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from .models import Course
from students.models import Student
from user.models import User
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
import json
from django.contrib.auth.models import AnonymousUser





class courseModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.course= Course.objects.create(
            academicYear="2024",
            courseName="TestCourse",
            grade="2",
            courseLanguage="Mandarin",
        )




    def test_get_course_info_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/course/')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)


    def test_post_course_unauthorized(self):
        self.client.force_authenticate(user=AnonymousUser())
        response = self.client.post('/api/course/')
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})


    def test_post_course_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        data={
            "academicYear":"2024",
            "courseName":"TestCourse",
            "grade": "2",
            "courseLanguage":"Mandarin",
        }
        response = self.client.post('/api/course/',data)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

class courseDetailModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.course= Course.objects.create(
            academicYear="2023",
            courseName="TestCourse",
            grade="3",
            courseLanguage="Mandarin",
        )
    def test_get_course_detail_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        url=reverse('courseDetail',kwargs={'courseId': self.course.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)


    def test_get_course_detail_unauthorized(self):
        self.client.force_authenticate(user=AnonymousUser())
        url=reverse('courseDetail',kwargs={'courseId': self.course.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})
    
class courseEnrollModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.course= Course.objects.create(
            academicYear="2022",
            courseName="TestCourse",
            grade="4",
            courseLanguage="Mandarin",
        )


        self.student1 =Student.objects.create (
            firstName= "John",
            lastName= "Doe",
            chineseName= "张三",
            address= "123 Main St",
            city= "Toronto",
            province="Ontario",
            postalCode= "M5B 2L7",
            DoB= "2000-01-01",
            gender= "Male",
            medicalHistory= "None",
            remark= "None",
            foip=True
        )


        self.student2 =Student.objects.create (
            firstName= "Jack",
            lastName= "Joe",
            chineseName= "李四",
            address= "234 Main St",
            city= "Edmonton",
            province="Alberta",
            postalCode= "T4V 2L7",
            DoB= "2000-01-02",
            gender= "Male",
            medicalHistory= "None",
            remark= "None",
            foip=True
        )


    def test_Course_enroll_unauthorized(self):
        self.client.force_authenticate(user=AnonymousUser())
        url=reverse('course_enroll',kwargs={'courseId': self.course.id})
        response = self.client.patch(url)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})


    def test_Course_enroll_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        url=reverse('course_enroll',kwargs={'courseId': self.course.id})
        data1 = {"studentIds": [self.student2.studentId]}
        response = self.client.patch(url,data1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data2={"studentIds": [self.student1.studentId]}
        response = self.client.patch(url,data2)
        self.course.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.student1 in self.course.enrolledStudents.all())
        self.assertTrue(self.student2 in self.course.enrolledStudents.all())    
        self.student1.refresh_from_db()
        self.assertTrue(self.course in self.student1.courses.all())
        self.student2.refresh_from_db()
        self.assertTrue(self.course in self.student2.courses.all())



    def test_Course_enroll_delete_unauthorized(self):
        self.client.force_authenticate(user=AnonymousUser())
        url=reverse('course_enroll',kwargs={'courseId': self.course.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})

    
    def test_Course_enroll_delete_authorized(self):
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        url=reverse('course_enroll',kwargs={'courseId': self.course.id})
        data1 = {"studentIds": [self.student2.studentId]}
        response = self.client.patch(url,data1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data2={"studentIds": [self.student1.studentId]}
        response = self.client.patch(url,data2)
        self.course.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.student1 in self.course.enrolledStudents.all())
        self.assertTrue(self.student2 in self.course.enrolledStudents.all())    
        self.student1.refresh_from_db()
        self.assertTrue(self.course in self.student1.courses.all())
        self.student2.refresh_from_db()
        self.assertTrue(self.course in self.student2.courses.all())
        response=self.client.delete(url,data1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student1.refresh_from_db()
        self.assertFalse(self.student2 in self.course.enrolledStudents.all())
        self.student1.refresh_from_db()
        response=self.client.delete(url,data2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student1.refresh_from_db()
        self.assertFalse(self.student1 in self.course.enrolledStudents.all())
        self.student1.refresh_from_db()

class CourseListTest(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin_user', password='admin_password', email='admin@example.com', is_staff=True
        )
        self.teacher_user = User.objects.create_user(
            username='teacher_user', password='teacher_password', email='teacher@example.com'
        )
        self.course_1 = Course.objects.create(
            academicYear='2022',
            courseName='Test Course 1',
            grade='3',
            courseLanguage='English',
        )
        self.course_2 = Course.objects.create(
            academicYear='2022',
            courseName='Test Course 2',
            grade='5',
            courseLanguage='French',
        )
        self.course_3 = Course.objects.create(
            academicYear='2022',
            courseName='Test Course 3',
            grade='1',
            courseLanguage='English',
        )





class course_membersTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.course= Course.objects.create(
            academicYear="2023",
            courseName="TestCourse",
            grade="5",
            courseLanguage="Mandarin",
        )


        self.student1 =Student.objects.create (
            firstName= "Jack",
            lastName= "Doe",
            chineseName= "张三",
            address= "222 Main St",
            city= "Toronto",
            province="Ontario",
            postalCode= "M5B 223",
            DoB= "2000-01-04",
            gender= "Male",
            medicalHistory= "None",
            remark= "None",
            foip=True
        )


        self.student2 =Student.objects.create (
            firstName= "Jack",
            lastName= "Joe",
            chineseName= "李四",
            address= "333 Main St",
            city= "Edmonton",
            province="Alberta",
            postalCode= "T4V 222",
            DoB= "2000-01-05",
            gender= "Female",
            medicalHistory= "None",
            remark= "None",
            foip=True
        )


    def test_course_member_unauthenticated(self):
        self.client.force_authenticate(user=AnonymousUser())
        url=reverse('course_members',kwargs={'courseId': self.course.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"message":"You need to be logged in to access this resource"})
    
    
    def test_course_member_authenticated(self):
        user = User.objects.create_user(username='testadmin1', email='test1@admin.com', password='adminpass1')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        url=reverse('course_enroll',kwargs={'courseId': self.course.id})
        data2={"studentIds": [self.student1.studentId]}
        response = self.client.patch(url,data2)
        self.course.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.student1 in self.course.enrolledStudents.all())
        self.student1.refresh_from_db()
        self.assertTrue(self.course in self.student1.courses.all())
        self.student2.refresh_from_db()
        url=reverse('course_members',kwargs={'courseId': self.course.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.course in self.student1.courses.all())