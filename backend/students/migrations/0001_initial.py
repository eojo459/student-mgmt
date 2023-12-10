# Generated by Django 4.1.6 on 2023-03-18 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mark', models.CharField(blank=True, max_length=20)),
                ('status', models.CharField(default='Enrolled', max_length=20)),
                ('comment', models.CharField(blank=True, max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('firstName', models.CharField(max_length=30)),
                ('lastName', models.CharField(max_length=30)),
                ('studentId', models.AutoField(primary_key=True, serialize=False)),
                ('chineseName', models.CharField(max_length=30)),
                ('address', models.CharField(max_length=30)),
                ('city', models.CharField(max_length=30)),
                ('province', models.CharField(max_length=30)),
                ('postalCode', models.CharField(max_length=30)),
                ('DoB', models.DateField()),
                ('gender', models.CharField(max_length=30)),
                ('medicalHistory', models.CharField(blank=True, max_length=30)),
                ('remark', models.CharField(blank=True, max_length=90)),
                ('registerDate', models.DateTimeField(auto_now_add=True)),
                ('foip', models.BooleanField()),
                ('disabled', models.BooleanField(default=False)),
                ('approved', models.BooleanField(default=False)),
                ('courses', models.ManyToManyField(through='students.Mark', to='course.course')),
            ],
        ),
    ]