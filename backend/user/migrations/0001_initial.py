# Generated by Django 4.1.6 on 2023-03-18 18:11

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course', '0002_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('role', models.CharField(choices=[('ADMIN', 'Admin'), ('PARENT', 'Parent'), ('TEACHER', 'Teacher')], max_length=50)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Admin',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('address', models.CharField(default='', max_length=30)),
                ('city', models.CharField(default='', max_length=30)),
                ('province', models.CharField(default='', max_length=30)),
                ('postalCode', models.CharField(default='', max_length=30)),
                ('cell', models.CharField(default='', max_length=30)),
                ('gender', models.CharField(default='', max_length=30)),
                ('chineseName', models.CharField(blank=True, max_length=30, null=True)),
                ('home', models.CharField(blank=True, max_length=30, null=True)),
                ('work', models.CharField(blank=True, max_length=30, null=True)),
                ('courses', models.ManyToManyField(blank=True, related_name='teachers', to='course.course')),
            ],
            options={
                'verbose_name': 'Teacher',
            },
            bases=('user.user',),
            managers=[
                ('teacher', django.db.models.manager.Manager()),
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Parent',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('address', models.CharField(max_length=30)),
                ('city', models.CharField(max_length=30)),
                ('province', models.CharField(max_length=30)),
                ('postalCode', models.CharField(max_length=30)),
                ('cell', models.CharField(max_length=30)),
                ('home', models.CharField(max_length=30)),
                ('business', models.CharField(max_length=30)),
                ('chineseName', models.CharField(blank=True, max_length=30, null=True)),
                ('studentID', models.ManyToManyField(blank=True, related_name='parents', to='students.student')),
            ],
            options={
                'verbose_name': 'Parent',
            },
            bases=('user.user',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]