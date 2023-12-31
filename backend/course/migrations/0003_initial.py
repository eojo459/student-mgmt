# Generated by Django 4.1.6 on 2023-03-18 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course', '0002_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='teacherId',
            field=models.ManyToManyField(related_name='teachers', to='user.teacher'),
        ),
    ]
