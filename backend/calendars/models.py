from django.db import models
from year.models import AcademicYear,CurrentAcademicYear

class calendar(models.Model):
    calendarId = models.AutoField(primary_key=True)
    academicYear=models.IntegerField()
    startDate = models.DateField()
    numWorkDays = models.IntegerField()
    days=models.ManyToManyField("calendars.day",blank=True)
class day(models.Model):
    calendarId = models.ForeignKey(calendar, on_delete=models.CASCADE)
    description = models.CharField(max_length=200,blank=True)
    Date = models.DateField()
    holiday = models.BooleanField(default=False)