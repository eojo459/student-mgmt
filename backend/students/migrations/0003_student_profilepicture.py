# Generated by Django 4.1.6 on 2023-03-18 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='profilePicture',
            field=models.ImageField(blank=True, default='default_profile_pic.jpg', null=True, upload_to=''),
        ),
    ]