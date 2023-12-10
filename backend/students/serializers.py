from rest_framework import serializers
from .models import Student, Mark
from course.models import Course
from user.models import Parent

class StudentSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Student
        fields = ['firstName', 'lastName','studentId','chineseName','address','city','province','postalCode','DoB','gender','parentId','medicalHistory','remark','disabled','courses','registerDate','foip', 'approved', 'profilePicture']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'ADMIN':
            validated_data['approved'] = True
            validated_data['disabled'] = False
        elif request and  request.user.is_authenticated and request.user.role == 'PARENT':
            validated_data['approved'] = False
            validated_data['disabled'] = True
        return super().create(validated_data)
    


class ShowAllStudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class MarkSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Mark
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'courseLanguage', 'academicYear', 'grade', 'courseName')

class StudentMarkSerializer(serializers.ModelSerializer):
    courseLanguage = serializers.CharField(source='courseId.courseLanguage')
    academicYear = serializers.CharField(source='courseId.academicYear')
    grade = serializers.CharField(source='courseId.grade')
    courseName = serializers.CharField(source='courseId.courseName')

    class Meta:
        model = Mark
        fields = ('id', 'courseLanguage', 'academicYear', 'grade', 'courseName', 'mark', 'status', 'comment')

# for contact list
class StudentContactSerializer(serializers.ModelSerializer):
    emails = serializers.SerializerMethodField()
    numbers = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ('firstName', 'lastName', 'DoB','chineseName', 'gender', 'emails', 'numbers', 'studentId', 'medicalHistory', 'remark', 'disabled', 'courses','approved','foip')

    def get_numbers(self, obj):
        phone_numbers = []
        for parent in obj.parents.all():
            phone_numbers.extend([phone for phone in [parent.cell, parent.home, parent.business] if phone])
        return phone_numbers

    def get_emails(self, obj):
        emails = []
        for parent in obj.parents.all():
            email = parent.email.strip()
            if email:
                emails.append(email)
        return emails
