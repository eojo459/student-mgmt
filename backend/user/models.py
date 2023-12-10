from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.fields import ArrayField
from django.db.models.fields.related import ManyToManyField


# https://www.youtube.com/watch?v=Ae7nc1EGv-A
# https://www.youtube.com/watch?v=Z6QMPAcS6E8

# -------------------------------------------------- BASE USERS (ADMIN) -------------------------------------------------- #
class User(AbstractUser): # (aka admins)
    id = models.AutoField(primary_key=True, null=False)
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        PARENT = "PARENT", "Parent"
        TEACHER = "TEACHER", "Teacher"

    base_role = Role.ADMIN

    role = models.CharField(max_length=50, choices=Role.choices)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.first_name + " " + self.last_name

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name

    class Meta:
        verbose_name = "Admin"

    

# -------------------------------------------------- PARENTS -------------------------------------------------- #

class ParentManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.PARENT)
    
    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.PARENT)
        user = self.model.objects.create_user(username, password=password, **extra_fields)
        user.role = User.Role.PARENT
        return user

class Parent(User):
    studentID = ManyToManyField("students.Student", related_name="parents", blank=True)
    address = models.CharField( max_length=30 )
    city = models.CharField( max_length=30 )
    province = models.CharField( max_length=30 )
    postalCode = models.CharField( max_length=30 )
    cell = models.CharField( max_length=30 )
    home = models.CharField( max_length=30 )
    business = models.CharField( max_length=30 )
    chineseName = models.CharField( max_length=30, blank=True,null=True )
    base_role = User.Role.PARENT

    class Meta:
        verbose_name = "Parent"

# class ParentProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"{self.user.first_name} {self.user.last_name}"

# @receiver(post_save, sender=Parent)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created and instance.role == User.Role.PARENT:
#         ParentProfile.objects.create(user=instance)

# -------------------------------------------------- TEACHERS -------------------------------------------------- #

class TeacherManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.TEACHER)


class Teacher(User):
    base_role = User.Role.TEACHER
    teacher = TeacherManager()
    address = models.CharField( max_length=30, default="" )
    city = models.CharField( max_length=30 , default="")
    province = models.CharField( max_length=30 , default="")
    postalCode = models.CharField( max_length=30, default="" )
    cell = models.CharField( max_length=30 , default="")
    gender = models.CharField( max_length=30, default="" )
    courses = ManyToManyField("course.Course", related_name="teachers", blank=True)
    chineseName = models.CharField( max_length=30, blank=True,null=True )
    home = models.CharField( max_length=30 , blank=True,null=True)
    work = models.CharField( max_length=30 , blank=True,null=True)


    class Meta:
        verbose_name = "Teacher"


# class TeacherProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     address = models.CharField( max_length=30 )
#     city = models.CharField( max_length=30 )
#     province = models.CharField( max_length=30 )
#     postalCode = models.CharField( max_length=30 )
#     cell = models.CharField( max_length=30 )
#     DoB = models.DateField()
#     gender = models.CharField( max_length=30 )
#     courses = ArrayField(base_field=models.CharField(max_length=20), null=True, blank=True)

#     def __str__(self):
#         return f"{self.user.first_name} {self.user.last_name}"

# @receiver(post_save, sender=Teacher)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created and instance.role == User.Role.TEACHER:
#         TeacherProfile.objects.create(user=instance)
