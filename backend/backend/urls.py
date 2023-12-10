"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from students import views as student_views
from course import views as course_views
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView )
from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view
from user import views as user_views
from newsletter import views as newsletter_views
from django.conf import settings
from django.conf.urls.static import static

scheme_view = swagger_get_schema_view(
    openapi.Info(
        title="Student API",
        default_version='v1',
        description="Student API",
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/', scheme_view.with_ui('swagger', cache_timeout=0), name = 'schema-swagger-ui'),
    path('api/', include('user.urls')),
    path('api/course/', include('course.urls')),
    path('api/', include('students.urls')),
    path('api/years/', include('year.urls')),
    path('api/', include('newsletter.urls')),
    path('api/calendars/', include('calendars.urls')),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
