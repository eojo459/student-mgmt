from django.shortcuts import render
from .models import Student,Mark
from .serializers import StudentSerializer, ShowAllStudentsSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import get_object_or_404
from user.models import Teacher
from course.models import Course
from course.serializers import CourseSerializer
from .serializers import StudentMarkSerializer, MarkSerializer, StudentContactSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import re
from django.urls import path
from ast import Delete, While
from operator import truediv
from platform import mac_ver
from select import select
import sqlite3
import time
import random
from tkinter import ALL
from tracemalloc import start
from unicodedata import name
from .models import Student
import os
from user.models import Parent
# Create your views here.


@swagger_auto_schema(
    method='get',
    operation_description='Get all students',
    responses={
        200: openapi.Response(
            description='List of all students',
            schema=StudentSerializer(many=True)
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='post',
    operation_description='Create a new student',
    request_body=StudentSerializer,
    responses={
        201: openapi.Response(
            description='The created student',
            schema=StudentSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['GET', 'POST'] )
def StudentInfo( request ):
    # /students/
    # make sure that a user is logged in so that we can check their role
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    # TODO: in the future, add permission checking for teachers and parents
    # teachers can only see their own students
    # parents can only see their own children
    elif( user.role != 'ADMIN' and user.role != 'PARENT' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        if(user.role == 'PARENT'):
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
        quertset = Student.objects.all()
        serializer_class = StudentSerializer( quertset, many=True )
        return Response( serializer_class.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # verification for postal code
        
        pattern = r'^[A-Z]\d[A-Z]\d[A-Z]\d$'
        # This pattern allows for postal codes in the following formats:
        #   - A1B2C3
        if not re.match(pattern, request.data['postalCode']):
            print(request.data['postalCode'])
            return Response( {"message":"Postal code is invalid"}, status=status.HTTP_400_BAD_REQUEST)

        



        serializer_class = StudentSerializer( data=request.data, context={'request': request} )
        if serializer_class.is_valid():
            student = serializer_class.save()
            if( user.role == 'PARENT' ):
                parent = Parent.objects.get( id = user.id )
                parent.studentID.add( student )
                student.parentId.add( parent )

            return Response( {"message":"New student added", "id": student.studentId },status=status.HTTP_201_CREATED)
        return Response( serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)



@swagger_auto_schema(
    method='get',
    operation_description='Get student by id',
    responses={
        200: openapi.Response(
            description='Student with the given id',
            schema=StudentSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='delete',
    operation_description='Delete student by id',
    responses={
        200: 'Student deleted',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='patch',
    operation_description='Edit student by id',
    request_body=StudentSerializer,
    responses={
        200: openapi.Response(
            description='Student modified',
            schema=StudentSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['DELETE', 'PATCH', 'GET'] )
def studentDetail(request,studentId):
    # /students/<studentId>/
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif user.role == 'PARENT':
        # parents can only see their own children 
        parent = Parent.objects.get( id = user.id )
        if not parent.studentID.filter( studentId=studentId ).exists():
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    elif( user.role != 'ADMIN' ):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    student = get_object_or_404(Student,studentId=studentId)
    if request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_200_OK)
    elif request.method=='PATCH':
        pattern = r'^[A-Z]\d[A-Z]\d[A-Z]\d$'
        # This pattern allows for postal codes in the following formats:
        #   - A1B2C3
        if request.data.get('postalCode') and not re.match(pattern, request.data['postalCode']):
            return Response( {"message":"Postal code is invalid"}, status=status.HTTP_400_BAD_REQUEST)
        serializer_class=StudentSerializer(student,data=request.data, partial=True)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response({"message":"Student modified"},status=status.HTTP_200_OK)
        else:
            return Response( serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='GET':
        serializer_class=StudentSerializer(student)
        return Response(serializer_class.data,status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description='Get a students marks and course information',
    responses={
        200: openapi.Response(
            description='List of marks and course information',
            schema=StudentMarkSerializer(many=True)
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['GET'] )
def StudentHistory(request,studentId):
    # /students/<studentId>/marks
    # returns mark along with some course information
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif user.role == 'PARENT':
        # parents can only see their own children 
        parent = Parent.objects.get( id = user.id )
        if not parent.studentID.filter( studentId=studentId ).exists():
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        marks = Mark.objects.filter(studentId=studentId)
        serializer = StudentMarkSerializer(marks, many=True)
        serialized_data = serializer.data

        # return the serialized data
        return Response(serialized_data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='PATCH',
    operation_description='Edit a students mark',
    request_body=MarkSerializer,
    responses={
        200: openapi.Response(
            description='Mark modified',
            schema=MarkSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['PATCH'] )
def StudentMark(request,studentId, markId):
    # /students/<studentId>/marks/<markId>
    # edit mark fields (mark, status, comment)
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PATCH':
        mark = get_object_or_404(Mark, id=markId)
        serializer = MarkSerializer(mark, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Mark modified"},status=status.HTTP_200_OK)
        else:
            return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='PATCH',
    operation_description='Disable a student',
    responses={
        200: openapi.Response(
            description='Student disabled',
            schema=StudentSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view(['PATCH'])
def StudentDisable(request, studentId):
    # /students/disable/<studentId>
    # edit mark fields (mark, status, comment)
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'PATCH':
        student = get_object_or_404(Student,studentId=studentId)
        student.disabled = not student.disabled
        serializer_class=StudentSerializer(student,data=request.data, partial=True)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response({"message":"Student status toggled"},status=status.HTTP_200_OK)
        else:
            return Response( serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    operation_description="Get a list of students with their parent's contact details",
    responses={
        200: openapi.Response(
            description='List of students',
            schema=StudentSerializer(many=True)
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['GET'] )
def StudentContacts(request):
    # /students/contacts/
    # returns list with parent email and number
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentContactSerializer(students, many=True)
        serialized_data = serializer.data
        # return the serialized data
        return Response(serialized_data, status=status.HTTP_200_OK)
    
def connect(path):
    global connection, cursor

    abs_path = os.path.abspath(path)
    connection = sqlite3.connect(abs_path)
    cursor = connection.cursor()
    cursor.execute(' PRAGMA foreign_keys=ON; ')
    connection.commit()
    return

@api_view( ['GET'] )
def dataMigration(request):
    # migrate data from old database
    # run this function once to migrate data from old database
    # this function will only work if the old database is still up
    # and the new database has been created
    # and the new database has been migrated
    # and the new database has been populated with the new data
    if request.method == 'GET':
        path = "students/NCAstudentData.db"
        connect(path)
        cursor.execute('SELECT FirstName, LastName, ChineseName, Address, City, Province, PostalCode, DoB, Gender, MedicalHistory, Remark, RegisterDate  FROM Student')
        studentsOProw = cursor.fetchall()
        for i in range (len(studentsOProw)):
                student1=Student.objects.create(
                    firstName=studentsOProw[i][0],
                    lastName=studentsOProw[i][1],
                    chineseName=studentsOProw[i][2],
                    address=studentsOProw[i][3],
                    city=studentsOProw[i][4],
                    province=studentsOProw[i][5],
                    postalCode=studentsOProw[i][6],
                    DoB=studentsOProw[i][7],
                    gender=studentsOProw[i][8],
                    medicalHistory=studentsOProw[i][9],
                    foip=True,
                    disabled=False,
                    approved=True,
                    remark=studentsOProw[i][10],
                    registerDate=studentsOProw[i][11],
                )
                student1.save()
        return Response({"message":"data migrated"}, status=status.HTTP_200_OK)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def CheckUnapprovedStudents(request):
    # /students/unapproved
    # returns amount of unapproved students
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        students = Student.objects.filter(approved=False)
        students = students.filter(disabled=True)
        # count how many students there are
        count = students.count()
        return Response({"count":count}, status=status.HTTP_200_OK)
