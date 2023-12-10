from .models import Course
from students.models import Mark
from rest_framework import serializers
from user.models import Teacher
from students.models import Student

class CourseSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Course
        fields = '__all__'
class DisplayEnrollCourseSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Course
        fields=['enrolledStudents']


# for getting all members of a course

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('studentId','firstName', 'lastName', 'chineseName', 'gender', 'medicalHistory', 'remark', 'DoB')
        ref_name = 'Student Course Member'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name', 'chineseName', 'address', 'city', 'province', 'postalCode')
        ref_name = 'Teacher Course Member'
        
class CourseMembersSerializer(serializers.ModelSerializer):
    teacherId = TeacherSerializer(many=True)
    enrolledStudents = StudentSerializer(many=True)

    class Meta:
        model = Course
        fields = ('id', 'academicYear', 'courseName', 'grade', 'courseLanguage', 'teacherId', 'enrolledStudents')


class CourseDescriptionSerializer(serializers.ModelSerializer):
    # with no teacher id, and student ids
    class Meta:
        model = Course
        fields = ('id', 'academicYear', 'courseName', 'grade', 'courseLanguage', )