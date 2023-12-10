from django.db import models

class AcademicYear(models.Model):
    year = models.IntegerField(unique=True)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.year}"

class CurrentAcademicYear(models.Model):
    academic_year = models.OneToOneField(AcademicYear, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return str(self.academic_year)

