from django.db import models
from django.contrib.postgres.fields import ArrayField
from user.models import Teacher
from django.db.models.fields.related import ManyToManyField


class Course(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    teacherId = ManyToManyField("user.Teacher", related_name="teachers")
    academicYear = models.CharField(max_length=4)
    courseName = models.CharField(max_length=30)
    grade = models.CharField(max_length=30)#Eg. grade 5 or grade 3, kindergarten = 0A or 0B, grade 1 = 1A or 1B. Rest only grade integer
    courseLanguage = models.CharField(max_length=30)
    enrolledStudents= ManyToManyField("students.Student", through="students.Mark")
