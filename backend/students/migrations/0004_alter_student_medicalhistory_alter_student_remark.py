# Generated by Django 4.1.6 on 2023-04-01 00:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0003_student_profilepicture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='medicalHistory',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AlterField(
            model_name='student',
            name='remark',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]
