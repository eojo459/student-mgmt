# Generated by Django 4.1.6 on 2023-03-18 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0003_alter_calendar_days'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calendar',
            name='days',
            field=models.ManyToManyField(blank=True, default=None, null=True, to='calendars.day'),
        ),
    ]
