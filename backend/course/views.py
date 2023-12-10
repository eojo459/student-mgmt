from django.shortcuts import render
from students.models import Student,Mark
from students.serializers import StudentSerializer
from .models import Course
from .serializers import CourseSerializer, CourseMembersSerializer, CourseDescriptionSerializer
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
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from year.models import CurrentAcademicYear, AcademicYear
from django.db.models.functions import Cast
from django.db.models import CharField, Value


@swagger_auto_schema(
    method='get',
    operation_description='Get all courses',
    responses={
        200: openapi.Response(
            description='List of all courses',
            schema=CourseSerializer(many=True)
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='post',
    operation_description='Create a new course',
    request_body=CourseSerializer,
    responses={
        201: openapi.Response(
            description='The created course',
            schema=CourseSerializer
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@api_view(['GET', 'POST'])
def CourseInfo(request):
    # api/course/
    # authorization check
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)


    # http methods
    if request.method== 'POST':
        serializer_class=CourseSerializer(data=request.data)
        if serializer_class.is_valid():
            course = serializer_class.save()
            # add teacher to course, and course to teacher
            # teacher ids is a list
            teacherIds = request.data['teacherId']
            for teacherId in teacherIds:
                teacher = Teacher.objects.get(id=teacherId)
                course.teacherId.add(teacher)
                teacher.courses.add(course)
            return Response({"message":"Course added"},status=status.HTTP_201_CREATED)
        return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method=='GET':
        AllCourse=Course.objects.all()
        serializer_class=CourseSerializer(AllCourse,many=True)
        return Response(serializer_class.data,status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_description='Get a specific course',
    responses={
        200: openapi.Response(
            description='The course',
            schema=CourseSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['GET'])
def CourseDetail(request,courseId):
    # api/course/<courseId>
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' and user.role != 'TEACHER'):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

    course = get_object_or_404(Course, pk=courseId)
    if request.method=='GET':
        serializer_class=CourseSerializer(course)
        return Response(serializer_class.data,status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='patch',
    operation_description='Enroll students to a course',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'studentIds': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
        }
    ),
    responses={
        200: openapi.Response(
            description='The course',
            schema=CourseSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@swagger_auto_schema(
    method='delete',
    operation_description='Remove students from a course',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'studentIds': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
        }
    ),
    responses={
        200: openapi.Response(
            description='The course',
            schema=CourseSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['PATCH','DELETE'])
def CourseEnroll(request, courseId):
    # api/course/enroll/<courseId>/
    # requires a list of studentIds in the body
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    
    elif( user.role != 'ADMIN' and user.role != 'PARENT' ):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    
    get_object_or_404(Course, pk=courseId)

    if request.method=='PATCH':
        course=Course.objects.get(pk=courseId)
        for x in request.data["studentIds"]:
            # get student object and save courseId to courses
            student = get_object_or_404(Student, pk=x)
            if user.role == 'PARENT' and not user.id in student.parentId.all().values_list('id', flat=True):
                return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
            course.enrolledStudents.add(x)
            student.courses.add(courseId)
            student.save()
        course.save()
        return Response({"message":"Students added"},status=status.HTTP_200_OK)
    if request.method=='DELETE':
        course=Course.objects.get(pk=courseId)
        for x in request.data["studentIds"]:
            course.enrolledStudents.remove(x)
        course.save()
        return Response({"message":"Students removed"},status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description='Get all students in a course',
    responses={
        200: openapi.Response(
            description='The course',
            schema=CourseMembersSerializer
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@permission_classes([IsAuthenticated, ])
@api_view( ['GET'])
def CourseMembers(request, courseId):
    # api/course/<courseId>/members
    # get all students in a course
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN'):
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    
    course = get_object_or_404(Course, pk=courseId)
    if request.method=='GET':
        serializer_class=CourseMembersSerializer(course)
        return Response(serializer_class.data,status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description='Get all courses',
    responses={
        200: openapi.Response(
            description='List of all courses',
            schema=CourseSerializer(many=True)
        ),
        401: 'Unauthorized',
        403: 'Forbidden'
    },
    security=[{'Bearer': []}]
)
@api_view(['GET'])
def CurrentCourseInfo(request):
    # api/course/current/
    if request.method=='GET':
        # Get all the unfinished academic years
        unfinished_years = AcademicYear.objects.filter(finished=False)

        # Get all the courses associated with the unfinished years
        unfinished_courses = Course.objects.filter(academicYear__in=unfinished_years.annotate(
            year_as_str=Cast('year', output_field=CharField())).values_list('year_as_str', flat=True))

        # Serialize the courses using the CourseSerializer
        serializer = CourseSerializer(unfinished_courses, many=True)

        # Return the serialized courses as a JSON response
        return Response(serializer.data)