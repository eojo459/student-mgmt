# Generated by Django 4.1.6 on 2023-03-18 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('students', '0001_initial'),
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='enrolledStudents',
            field=models.ManyToManyField(through='students.Mark', to='students.student'),
        ),
    ]
