# Generated by Django 4.1.6 on 2023-04-03 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('year', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='academicyear',
            name='finished',
            field=models.BooleanField(default=False),
        ),
    ]
