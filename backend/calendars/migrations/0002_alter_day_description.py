# Generated by Django 4.1.5 on 2023-03-18 03:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='day',
            name='description',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
