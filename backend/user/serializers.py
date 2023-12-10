from rest_framework import serializers
from .models import Parent, Teacher, User
from course.models import Course

class ParentSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Parent
        fields = ['address', 'city', 'province', 'postalCode','password', 'first_name', 'last_name', 'email','username','cell','home', 'business', 'chineseName']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True},
            'username': {'required': True},
            'address': {'required': True},
            'city': {'required': True},
            'province': {'required': True},
            'postalCode': {'required': True},
            'cell': {'required': True},
            'home': {'allow_blank': True},
            'business': {'allow_blank': True},
            'chineseName': {'allow_blank': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class AllInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'

class StudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ['studentID']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['address', 'city', 'province', 'postalCode','password', 'first_name', 'last_name', 'email','username','cell','home', 'work', 'chineseName', 'gender']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True},
            'username': {'required': True},
            'address': {'required': True},
            'city': {'required': True},
            'province': {'required': True},
            'postalCode': {'required': True},
            'cell': {'required': True},
            'home': {'allow_blank': True},
            'work': {'allow_blank': True},
            'chineseName': {'allow_blank': True},
            'gender' : {'required': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class AllTeacherInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# serializers for courses of a teacher
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'academicYear', 'courseName', 'grade', 'courseLanguage']
        ref_name = 'Teacher Course Info'

class TeacherProfileSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'address', 'city', 'province', 'postalCode', 'cell', 'gender', 'courses', 'chineseName', 'home', 'work']