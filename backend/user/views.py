from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Parent, Teacher
from .serializers import ParentSerializer, AllInfoSerializer, StudentsSerializer, TeacherSerializer, AllTeacherInfoSerializer, TeacherProfileSerializer
from rest_framework import status
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from students.models import Student
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import re

User = get_user_model()

class ParentInfo(APIView):
    # for /api/parent/

    @swagger_auto_schema(
        operation_description='Get all parents',
        responses={
            200: openapi.Response(
                description='List of all parents',
                schema=AllInfoSerializer(many=True)
            ),
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def get(self, request):
        # make sure requester is admin
        user = request.user
        if(type(user) == AnonymousUser):
            return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
        elif( user.role != 'ADMIN'):
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
  
        queryset = Parent.objects.all()
        serializer_class = AllInfoSerializer(queryset, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description='Create a new parent',
        request_body=ParentSerializer,
        responses={
            201: openapi.Response(
                description='The id of the created parent, and a message',
                schema=ParentSerializer
            ),
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden'
        },
    )
    def post(self, request):
        pattern = r'^[A-Z]\d[A-Z]\d[A-Z]\d$'
        # This pattern allows for postal codes in the following formats:
        #   - A1B2C3
        phone_pattern = r'^(?:\+?\d{1,3}[ -]?)?(?:\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$'
        # This pattern allows for phone numbers in the following formats:
        #   - +1234567890
        #   - +1 234-567-8901
        #   - 12345678901
        #   - 234-567-8901
        if not re.match(pattern, request.data['postalCode']):
            return Response( {"message":"Postal code is invalid, please use the format of A1A1A1"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(phone_pattern, request.data['cell']):
            return Response( {"message":"Cell phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['home'] != "" and not re.match(phone_pattern, request.data['home']):
            return Response( {"message":"Home phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['business'] != "" and not re.match(phone_pattern, request.data['business']):
            return Response( {"message":"Business phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)

        serializer_class = ParentSerializer(data=request.data)
        if serializer_class.is_valid():
            parent = serializer_class.save()
            return Response({"message": "Parent created", "id": parent.id}, status=status.HTTP_201_CREATED)
        return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ParentDetail(APIView):
    # for /api/parent/<parentId>/
    permission_classes = [IsAuthenticated, ]

    @swagger_auto_schema(
        operation_description='Get a parent',
        responses={
            200: openapi.Response(
                description='The parent data.',
                schema=AllInfoSerializer
            ),
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def get(self, request, parentId): 
        user = request.user
        if user.role == 'ADMIN' or parentId == user.id:
            TheParent = get_object_or_404(Parent, pk=parentId)
            serializer_class = AllInfoSerializer(TheParent)
            return Response(serializer_class.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description='Update a parent',
        request_body=ParentSerializer,
        responses={
            200: 'Parent updated',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def patch(self, request, parentId):
        pattern = r'^[A-Z]\d[A-Z]\d[A-Z]\d$'
        # This pattern allows for postal codes in the following formats:
        #   - A1B2C3
        phone_pattern = r'^(?:\+?\d{1,3}[ -]?)?(?:\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$'
        # This pattern allows for phone numbers in the following formats:
        #   - +1234567890
        #   - +1 234-567-8901
        #   - 12345678901
        #   - 234-567-8901
        if not re.match(pattern, request.data['postalCode']):
            return Response( {"message":"Postal code is invalid, please use the format of A1A1A1"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(phone_pattern, request.data['cell']):
            return Response( {"message":"Cell phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['home'] != "" and not re.match(phone_pattern, request.data['home']):
            return Response( {"message":"Home phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['business'] != "" and not re.match(phone_pattern, request.data['business']):
            return Response( {"message":"Business phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)

        TheParent = get_object_or_404(Parent, pk=parentId)
        serializer_class = ParentSerializer(TheParent, data=request.data, partial=True)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response({"message": "Parent updated"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

class ParentStudent(APIView):
    # for /api/parent/<parentId>/students/
    permission_classes = [IsAuthenticated, ]

    @swagger_auto_schema(
        operation_description='Get a parent\'s children',
        responses={
            200: openapi.Response(
                description='The parent\'s children.',
                schema=StudentsSerializer
            ),
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def get(self, request, parentId):
        TheParent = get_object_or_404(Parent, pk=parentId)
        serializer_class = StudentsSerializer(TheParent)
        return Response(serializer_class.data['studentID'], status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description='Add a child to a parent',
        request_body=StudentsSerializer,
        responses={
            200: 'Student added to parent',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def post(self, request, parentId):

        # make sure request has studentId
        user = request.user
        if user.role != 'ADMIN':
            return Response({"message": "You are not authorized to add a student to a parent"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if('studentId' not in request.data):
            return Response({"message": "Student ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        TheParent = get_object_or_404(Parent, pk=parentId)
        TheParent.studentID.add(request.data['studentId'])
        student = get_object_or_404(Student, pk=request.data['studentId'])

        # make sure parent can only add students to their own account
        # if user.role == 'PARENT' and student.approved == True and student.parentId.count() > 0:
        #    return Response({"message": "Student not approved"}, status=status.HTTP_400_BAD_REQUEST)
            
        student.parentId.add(parentId)

        serializer_class = StudentsSerializer(TheParent, data=request.data, partial=True)
        serializer_class2 = StudentsSerializer(student, data=request.data, partial=True)

        if serializer_class.is_valid() and serializer_class2.is_valid():
            serializer_class.save()
            serializer_class2.save()
            return Response({"message": "Student added to parent"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@swagger_auto_schema(
    method='get',
    operation_description='Get a list of all teachers',
    responses={
        200: openapi.Response(
            description='The list of teachers.',
            schema=TeacherSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='post',
    operation_description='Create a new teacher',
    request_body=TeacherSerializer,
    responses={
        201: openapi.Response(
            description='The id of the created teacher, and a message',
            schema=TeacherSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['POST','GET'] )
def TeacherInfo( request ):
    # for /api/teacher/

    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    if request.method=='POST':
        pattern = r'^[A-Z]\d[A-Z]\d[A-Z]\d$'
        # This pattern allows for postal codes in the following formats:
        #   - A1B2C3
        phone_pattern = r'^(?:\+?\d{1,3}[ -]?)?(?:\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$'
        # This pattern allows for phone numbers in the following formats:
        #   - +1234567890
        #   - +1 234-567-8901
        #   - 12345678901
        #   - 234-567-8901
        if not request.data.get('postalCode') or not request.data.get('cell'):
            return Response( {"message":"Postal code and cell phone number are required"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(pattern, request.data['postalCode']):
            return Response( {"message":"Postal code is invalid, please use the format of A1A1A1"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(phone_pattern, request.data['cell']):
            return Response( {"message":"Cell phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get('home') and not re.match(phone_pattern, request.data['home']):
            return Response( {"message":"Home phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get('work') and not re.match(phone_pattern, request.data['work']):
            return Response( {"message":"Business phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)

        newdata = request.data
        newdata['role']='TEACHER'
        serializer_class = TeacherSerializer( data=newdata )
        if serializer_class.is_valid():
            teacher = serializer_class.save()
            return Response( {"message":"New Teacher added", "id": teacher.id},status=status.HTTP_201_CREATED)
        else:
            return Response( serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)


    elif request.method=='GET':
        try:
            teachers = Teacher.objects.all()
            serializer_class = AllTeacherInfoSerializer( teachers, many=True )
            return Response( serializer_class.data, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Internal Error"},status=status.HTTP_500_INTERNAL_SERVER_ERROR )


@swagger_auto_schema(
    method='get',
    operation_description='Get a teacher\'s info',
    responses={
        200: openapi.Response(
            description='The teacher\'s info.',
            schema=TeacherSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='patch',
    operation_description='Update a teacher\'s info',
    request_body=TeacherSerializer,
    responses={
        200: openapi.Response(
            description='A message',
            schema=TeacherSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@api_view( ['GET', 'PATCH'] )
def TeacherDetail( request,id ):
    # for /api/teacher/<id>/
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' and user.id != id):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method=='GET':
        teacher = get_object_or_404(Teacher, pk=id)
        serializer_class = AllTeacherInfoSerializer(teacher)
        return Response( serializer_class.data, status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        pattern = r'^[A-Z]\d[A-Z]\d[A-Z]\d$'
        # This pattern allows for postal codes in the following formats:
        #   - A1B2C3
        phone_pattern = r'^(?:\+?\d{1,3}[ -]?)?(?:\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$'
        # This pattern allows for phone numbers in the following formats:
        #   - +1234567890
        #   - +1 234-567-8901
        #   - 12345678901
        #   - 234-567-8901
        if not request.data.get('postalCode') or not request.data.get('cell'):
            return Response( {"message":"Postal code and cell phone number are required"}, status=status.HTTP_400_BAD_REQUEST)  
        if not re.match(pattern, request.data['postalCode']):
            return Response( {"message":"Postal code is invalid, please use the format of A1A1A1"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(phone_pattern, request.data['cell']):
            return Response( {"message":"Cell phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['home'] != "" and not re.match(phone_pattern, request.data['home']):
            return Response( {"message":"Home phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['work'] != "" and not re.match(phone_pattern, request.data['work']):
            return Response( {"message":"Business phone number is invalid, please use the format of 1234567890, or 234-567-8901"}, status=status.HTTP_400_BAD_REQUEST)

        teacher = get_object_or_404(Teacher, pk=id)
        serializer_class = TeacherSerializer(teacher, data=request.data, partial=True)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response({"message": "Teacher updated"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    operation_description='Deactivate a teacher',
    responses={
        200: openapi.Response(
            description='A message',
            schema=TeacherSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['PUT'] )
def DeactivateTeacher( request,id ):
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    user = get_object_or_404(User, pk=id)
    
    # make sure it is a teacher?
    teacher = get_object_or_404(Teacher, pk=id)

    user.is_active=False
    user.save()
    return Response( {"message": "Successfully deactivated user"}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description='Get a teacher\'s profile',
    responses={
        200: openapi.Response(
            description='The teacher\'s profile.',
            schema=TeacherProfileSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@api_view( ['GET'] )
def TeacherProfile( request,id ):
    # for /api/teacher/<id>/profile/
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' and user.id != id):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    if request.method=='GET':
        teacher = get_object_or_404(Teacher, pk=id)
        serialized_teacher = TeacherProfileSerializer(teacher,many=False)
        return Response( serialized_teacher.data, status=status.HTTP_200_OK)
   