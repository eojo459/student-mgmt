# Generated by Django 4.1.6 on 2023-03-18 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0004_alter_calendar_days'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calendar',
            name='days',
            field=models.ManyToManyField(blank=True, to='calendars.day'),
        ),
    ]
