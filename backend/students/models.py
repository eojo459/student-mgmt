from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models.fields.related import ManyToManyField

# from teachers.models import Course
# from django.apps import apps
# course = apps.get_model('teachers','Course')

# Create your models here.

class Student( models.Model ):
    firstName = models.CharField( max_length=30 )
    lastName = models.CharField( max_length=30 )
    studentId = models.AutoField(primary_key=True)
    chineseName = models.CharField( max_length=30 )
    address = models.CharField( max_length=30 )
    city = models.CharField( max_length=30 )
    province = models.CharField( max_length=30 )
    postalCode = models.CharField( max_length=30 )
    # cell = models.CharField( max_length=30, blank=True, null=True ) moved to
    DoB = models.DateField()
    gender = models.CharField( max_length=30 )
    parentId = ManyToManyField("user.Parent", related_name="parents", blank=True )
    medicalHistory = models.CharField( max_length=1000, blank=True )
    remark = models.CharField( max_length=1000, blank=True )
    registerDate =  models.DateTimeField(auto_now_add=True)
    courses = models.ManyToManyField("course.Course", through="Mark")
    foip = models.BooleanField()
    disabled = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)
    profilePicture = models.ImageField(null=True, blank=True, default="default_profile_pic.jpg")

    def __str__( self ):
        return self.firstName + " " + self.lastName

class Mark(models.Model):
    courseId = models.ForeignKey("course.Course", on_delete=models.CASCADE)
    studentId = models.ForeignKey(Student, on_delete=models.CASCADE)
    mark = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, default="Enrolled") # enrolled, completed, dropped?
    comment = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return  self.id.__str__() + " - " + self.studentId.firstName + " " + self.studentId.lastName 

