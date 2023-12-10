from django.test import TestCase
from user.models import Parent, Teacher, User
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import AnonymousUser
import json
from course.models import Course

class UserModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            first_name="Test",
            last_name="User",
            username="testuser",
            password="testpassword",
        )

    def test_user_str_representation(self):
        self.assertEqual(str(self.user), "Test User")

    def test_user_full_name(self):
        self.assertEqual(self.user.get_full_name(), "Test User")

    def test_user_short_name(self):
        self.assertEqual(self.user.get_short_name(), "Test")

    def test_user_role(self):
        self.assertEqual(self.user.role, "ADMIN")

    def test_user_jwt_authentication(self):
        url = '/api/token/'
        u = User.objects.create_user(username='user', email='user@foo.com', password='pass')
        u.is_active = False
        u.save()

        resp = self.client.post(url, {'username':'user', 'password':'pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

        u.is_active = True
        u.save()

        resp = self.client.post(url, {'username':'user', 'password':'pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)



class ParentModelTestCase(TestCase):
    def setUp(self):
        self.parent = Parent.objects.create(
            first_name="Test",
            last_name="Parent",
            email="testparent@email.com",
            password="testpassword",
            username="testparent",
            cell="1234567890",
        )
    
    # model tests
    def test_parent_str_representation(self):
        self.assertEqual(str(self.parent), "Test Parent")

    def test_parent_full_name(self):
        self.assertEqual(self.parent.get_full_name(), "Test Parent")

    def test_parent_short_name(self):
        self.assertEqual(self.parent.get_short_name(), "Test")

    def test_parent_role(self):
        self.assertEqual(self.parent.role, "PARENT")

    def test_parent_jwt_authentication(self):
        url = '/api/token/'
        u = Parent.objects.create_user(username='parent', email='parent@foo.com', password='pass')
        u.is_active = False
        u.save()

        resp = self.client.post(url, {'username':'parent', 'password':'pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

        u.is_active = True
        u.save()

        resp = self.client.post(url, {'username':'parent', 'password':'pass'}, format='json')
        
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

class TeacherModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # make course for teacher to teach

        self.course= Course.objects.create(
            academicYear="2024",
            courseName="TestCourse",
            grade="2",
            courseLanguage="Mandarin",
        )

        self.course.save()

        self.teacher = Teacher.objects.create(
            first_name="Test",
            last_name="Teacher",
            email="testteacher@email.com",
            password="testpassword",
            address="Test Address",
            city="Test City",
            province="Test Province",
            postalCode="Test Postal Code",
            cell="Test Cell",
            gender="Test Gender",
        )
        self.teacher.courses.add(self.course)
       
        self.postData = {
            "first_name":"Test",
            "last_name":"Teacher",
            "email":"test@teacher.com",
            "password":"testpassword",
            "address":"Test Address",
            "city":"Test City",
            "province":"Test Province",
            "postalCode":"A1A1A1",
            "cell":"1234567890",
            "gender":"Test Gender",
            'username': "teacherusername",
            "password": 'teacherpass'
        }
    
    def test_teacher_str_representation(self):
        self.assertEqual(str(self.teacher), "Test Teacher")

    def test_teacher_full_name(self):
        self.assertEqual(self.teacher.get_full_name(), "Test Teacher")

    def test_teacher_short_name(self):
        self.assertEqual(self.teacher.get_short_name(), "Test")

    def test_teacher_role(self):
        self.assertEqual(self.teacher.role, "TEACHER")

    def test_teacher_address(self):
        self.assertEqual(self.teacher.address, "Test Address")

    def test_teacher_city(self):
        self.assertEqual(self.teacher.city, "Test City")
    
    def test_teacher_create_success(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)

        response = self.client.post('/api/teacher/',self.postData,format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_teacher_create_without_all_data(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)

        response = self.client.post('/api/teacher/',{"insufficient":"data"},format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_teacher_create_without_admin_user(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="PARENT"
        self.client.force_authenticate(user=user)

        response = self.client.post('/api/teacher/',self.postData,format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_create_without_authenticated_user(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        # self.client.force_authenticate(user=user)

        response = self.client.post('/api/teacher/',self.postData,format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    
    def test_get_newly_created_teacher(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)

        resp = self.client.post('/api/teacher/',self.postData,format='json')

        response = self.client.get('/api/teacher/',{'username':'testadmin', 'password':'adminpass'},format='json')
        # print(response)

        self.assertGreaterEqual(len(response.data),2) 
        if len(response.data)>1:
            self.assertEqual(response.data[1]["username"],self.postData["username"])
            # password will be hashed in database
            #self.assertEqual(response.data[1]["password"],self.postData["password"])
            self.assertEqual(response.data[1]["email"],self.postData["email"])
            self.assertEqual(response.data[1]["first_name"],self.postData["first_name"])
            self.assertEqual(response.data[1]["last_name"],self.postData["last_name"])
            self.assertEqual(response.data[1]["address"],self.postData["address"])
            self.assertEqual(response.data[1]["postalCode"],self.postData["postalCode"])
            self.assertEqual(response.data[1]["province"],self.postData["province"])
            self.assertEqual(response.data[1]["city"],self.postData["city"])
            self.assertEqual(response.data[1]["cell"],self.postData["cell"])
            self.assertEqual(response.data[1]["role"],"TEACHER")
            self.assertEqual(response.data[1]["chineseName"],None)
            self.assertEqual(response.data[1]["work"],None)
            self.assertEqual(response.data[1]["home"],None)
            self.assertEqual(response.data[1]["courses"],[])

    def test_get_all_teachers(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/teacher/',{'username':'testadmin', 'password':'adminpass'},format='json')

        self.assertNotEqual(response.data,None)
        self.assertGreaterEqual(len(response.data),1)

        checkRequiredFieldsExistInOneEntry = (response.data[0]['first_name']!=None and response.data[0]['last_name']!=None and response.data[0]['username']!=None and response.data[0]['email']!=None and response.data[0]['gender']!=None and response.data[0]['address']!=None and response.data[0]['city']!=None and response.data[0]['postalCode']!=None and response.data[0]['province']!=None and response.data[0]['cell']!=None)
        self.assertEqual(checkRequiredFieldsExistInOneEntry,True)
    

    def test_get_one_teacher(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)

        url = f"/api/teacher/{self.teacher.id}"
        response = self.client.get(url,{'username':'testadmin', 'password':'adminpass'},format='json')

        self.assertEqual(response.data["username"],self.teacher.username)
        self.assertEqual(response.data["password"],self.teacher.password)
        self.assertEqual(response.data["email"],self.teacher.email)
        self.assertEqual(response.data["first_name"],self.teacher.first_name)
        self.assertEqual(response.data["last_name"],self.teacher.last_name)
        self.assertEqual(response.data["address"],self.teacher.address)
        self.assertEqual(response.data["postalCode"],self.teacher.postalCode)
        self.assertEqual(response.data["province"],self.teacher.province)
        self.assertEqual(response.data["city"],self.teacher.city)
        self.assertEqual(response.data["cell"],self.teacher.cell)
        self.assertEqual(response.data["role"],"TEACHER")
        self.assertEqual(response.data["chineseName"],None)
        self.assertEqual(response.data["work"],None)
        self.assertEqual(response.data["home"],None)
        #self.assertEqual(response.data["courses"],self.teacher.courses)
    
    def test_get_not_found(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        self.client.force_authenticate(user=user)
        wrongId = -1
        url = f"/api/teacher/{wrongId}"
        response = self.client.get(url,{'username':'testadmin', 'password':'adminpass'},format='json')
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)

    
    def test_deactivate_teacher(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"

        self.client.force_authenticate(user=user)

        url = f"/api/teacher/{self.teacher.id}"
        response = self.client.get(url,{'username':'testadmin', 'password':'adminpass'},format='json')
        #check if created teacher is already active
        self.assertEqual(response.data["is_active"], True)

        deactivateUrl = url+'/deactivate/'
        deactivateResponse = self.client.put(deactivateUrl, {'username':'testadmin', 'password':'adminpass'},format='json')

        self.assertEqual(deactivateResponse.status_code, status.HTTP_200_OK)

        newResponse = self.client.get(url,{'username':'testadmin', 'password':'adminpass'},format='json')

        self.assertEqual(newResponse.data["is_active"],False)
    
    def test_deactivate_non_teacher(self):
        authenticateUrl = '/api/token/'
        self.client.post(authenticateUrl, {'username':'testadmin', 'password':'adminpass'}, format='json')
        user = User.objects.create_user(username='testadmin', email='test@admin.com', password='adminpass')
        user.role="ADMIN"
        
        self.client.force_authenticate(user=user)

        url = f"/api/teacher/{user.id}"
        # response = self.client.get(url,{'username':'testadmin', 'password':'adminpass'},format='json')
        #check if created teacher is already active
        # self.assertEqual(response.data["is_active"], True)

        deactivateUrl = url+'/deactivate/'
        deactivateResponse = self.client.put(deactivateUrl, {'username':'testadmin', 'password':'adminpass'},format='json')

        self.assertEqual(deactivateResponse.status_code, status.HTTP_404_NOT_FOUND)

        


        




        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
