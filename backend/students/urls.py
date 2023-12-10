from django.urls import path
from .views import studentDetail, StudentInfo, StudentHistory, StudentMark, StudentContacts, StudentDisable,dataMigration

from .views import studentDetail, StudentInfo, StudentHistory, StudentMark, StudentContacts, StudentDisable, CheckUnapprovedStudents

urlpatterns = [
    path('students/', StudentInfo, name='studentinfo'),
    path('students/<int:studentId>', studentDetail,name='studentDetail'),
    path('students/disable/<int:studentId>', StudentDisable,name='studentDis'),
    path('students/<int:studentId>/marks', StudentHistory,name='studentHistory' ),
    path('students/<int:studentId>/marks/<int:markId>', StudentMark,name='studentMark' ),
    path('students/contacts/', StudentContacts ,name='studentMarkEdit'),
    path('students/unapproved/', CheckUnapprovedStudents ,name='unapprovedStudents'),
    path('students/migrateData', dataMigration ,name='MigrateData '),
]



