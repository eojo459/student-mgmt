from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import AcademicYear, CurrentAcademicYear
from .serializers import AcademicYearSerializer, CurrentAcademicYearSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from django.contrib.auth.models import AnonymousUser
from students.models import Mark
from course.models import Course
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi



class AcademicYears(APIView):
    # /api/years/all/
    # for getting all academic years

    @swagger_auto_schema(
        operation_description='Get all academic years',
        responses={
            200: openapi.Response(
                description='All academic years',
                schema=AcademicYearSerializer
            ),
        },
    )
    def get(self, request):
        academic_years = AcademicYear.objects.all()
        serializer = AcademicYearSerializer(academic_years, many=True)

        # get current academic year
        current_academic_year = CurrentAcademicYear.objects.first()

        return Response({'years': serializer.data, 'current_year': CurrentAcademicYearSerializer(current_academic_year).data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description='Create a new academic year',
        responses={
            201: openapi.Response(
                description='Created academic year',
                schema=AcademicYearSerializer
            ),
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        user = request.user
        if(type(user) == AnonymousUser):
            return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
        elif( user.role != 'ADMIN' ):
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)

        serializer = AcademicYearSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # check if a current academic year has been set, if not, then set it as the current
            current_academic_year = CurrentAcademicYear.objects.first()
            if not current_academic_year:
                current_academic_year = CurrentAcademicYear.objects.create(academic_year=serializer.instance)
                current_academic_year.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentYear(APIView):
    # for getting the current academic year and setting the current academic year
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    @swagger_auto_schema(
        operation_description='Set current academic year',
        responses={
            200: openapi.Response(
                description='Current academic year set',
                schema=CurrentAcademicYearSerializer
            ),
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        if not request.user.is_superuser:
            return Response({'message': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        academic_year_id = request.data.get('year')
        academic_year = AcademicYear.objects.get(id=academic_year_id)
        # clear the current academic year
        CurrentAcademicYear.objects.all().delete()

        # set the new current academic year
        current_academic_year = CurrentAcademicYear.objects.create(academic_year=academic_year)
        current_academic_year.save()

        return Response({'message': 'Current academic year has been set successfully.'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description='Get current academic year',
        responses={
            200: openapi.Response(
                description='Current academic year',
                schema=CurrentAcademicYearSerializer
            ),
        },
    )
    def get(self, request):
        current_academic_year = CurrentAcademicYear.objects.first()
        serializer = CurrentAcademicYearSerializer(current_academic_year)
        return Response(serializer.data)

class ActiveYears(APIView):
    # for obtaining academic years that are not "finished"
    # /api/years/active/
    @swagger_auto_schema(
        operation_description='Get active academic years',
        responses={
            200: openapi.Response(
                description='Active academic years',
                schema=AcademicYearSerializer
            ),
        },
    )
    def get(self, request):
        academic_years = AcademicYear.objects.filter(finished=False)
        serializer = AcademicYearSerializer(academic_years, many=True)

        # get current academic year
        current_academic_year = CurrentAcademicYear.objects.first()

        return Response({'years': serializer.data, 'current_year': CurrentAcademicYearSerializer(current_academic_year).data}, status=status.HTTP_200_OK)


class FinishYear(APIView):
    # finishing academic year
    # /api/years/current/finish/
    @swagger_auto_schema(
        operation_description='Finish academic year',
        responses={
            200: openapi.Response(
                description='Academic year finished',
                schema=AcademicYearSerializer
            ),
            401: 'Unauthorized',
            403: 'Forbidden'
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        if not request.user.is_superuser:
            return Response({'message': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        # get the current academic year
        current_academic_year = CurrentAcademicYear.objects.first()

        # make sure that there are no other previous academic years that are not finished
        previous_academic_years = AcademicYear.objects.filter(year__lt=current_academic_year.academic_year.year, finished=False)
        if previous_academic_years:
            return Response({'message': 'There are previous academic years that are not finished.'}, status=status.HTTP_400_BAD_REQUEST)

        academic_year = current_academic_year.academic_year
        academic_year.finished = True
        academic_year.save()

        # get all courses for the current academic year
        courses = Course.objects.filter(academicYear=academic_year)

        # loop over the courses
        for course in courses:
        # get all marks for the current course and academic year
            marks = Mark.objects.filter(courseId=course, studentId__in=course.enrolledStudents.all(), status='Enrolled')

            # update the status of the marks to "Completed"
            for mark in marks:
                mark.status = 'Completed'
                mark.save()

        # delete the current academic year
        current_academic_year.delete()

        # check if the next academic year exists
        next_academic_year = AcademicYear.objects.filter(year=academic_year.year + 1).first()
        if next_academic_year:
            # set the next academic year as the current academic year
            current_academic_year = CurrentAcademicYear.objects.create(academic_year=next_academic_year)
            current_academic_year.save()

            return Response({'message': 'Current academic year has been finished successfully.'}, status=status.HTTP_200_OK)
        # if the next academic year does not exist, create it
        new_academic_year = AcademicYear.objects.create(year=academic_year.year + 1)

        # set the new academic year as the current academic year
        current_academic_year = CurrentAcademicYear.objects.create(academic_year=new_academic_year)
        current_academic_year.save()



        return Response({'message': 'Current academic year has been finished successfully.'}, status=status.HTTP_200_OK)