from django.contrib import admin
from .models import User, Parent, Teacher
from django.contrib.auth.admin import UserAdmin

# https://www.youtube.com/watch?v=sSKYEMEU-C8

class UserAdminConfig(UserAdmin):
    model = User
    search_fields = ('id', 'first_name', 'last_name')
    list_filter = ('id', 'first_name', 'last_name', 'is_active', 'is_staff')
    list_display = ('id', 'first_name', 'last_name', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'first_name', 'last_name', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username','email', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff')}
            ),
    )

class TeacherAdminConfig(UserAdmin):
    model = Teacher
    search_fields = ('id', 'first_name', 'last_name')
    list_filter = ('id', 'first_name', 'last_name', 'is_active', 'is_staff')
    list_display = ('id', 'first_name', 'last_name', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'first_name', 'last_name', 'password', 'address', 'city',  'province', 'cell', 'gender')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username','email', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff', 'address', 'city', 'province', 'cell', 'gender')}
            ),
    )

class ParentAdminConfig(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'chineseName', 'studentID')}),
        ('Contact info', {'fields': ('address', 'city', 'province', 'postalCode', 'cell')}),
        ('Permissions', {'fields': ('is_active',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'chineseName', 'studentID', 'address', 'city', 'province', 'postalCode', 'cell')}
        ),
    )


admin.site.register(User, UserAdminConfig)
admin.site.register(Parent, ParentAdminConfig)
admin.site.register(Teacher, TeacherAdminConfig)
