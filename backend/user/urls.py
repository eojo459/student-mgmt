from django.urls import path
from .views import MyTokenObtainPairView, ParentInfo, ParentDetail, ParentStudent, TeacherInfo, TeacherDetail, DeactivateTeacher, TeacherProfile

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenBlacklistView


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('parent/', ParentInfo.as_view(), name='parentinfo'),
    path('parent/<int:parentId>', ParentDetail.as_view(),name='parentdetail'),
    path('parent/<int:parentId>/students/', ParentStudent.as_view(), name='parentstudent'),
    path('teacher/', TeacherInfo, name='teacherinfo'),
    path('teacher/<int:id>', TeacherDetail,name='teacherdetail'),
    path('teacher/<int:id>/deactivate/', DeactivateTeacher, name='deactivateteacher'),
    path('teacher/<int:id>/profile/', TeacherProfile, name='teacherprofile')

]