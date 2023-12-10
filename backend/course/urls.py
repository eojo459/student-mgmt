from django.urls import path

from .views import CourseInfo, CourseDetail, CourseEnroll, CourseMembers, CurrentCourseInfo


urlpatterns = [
    path('', CourseInfo, name='courseinfo'),
    path('<int:courseId>', CourseDetail,name='courseDetail'),
    path('enroll/<int:courseId>', CourseEnroll,name='course_enroll'),
    path('<int:courseId>/members/', CourseMembers,name='course_members'),
    path('current/', CurrentCourseInfo, name='current_courseinfo'),
]

