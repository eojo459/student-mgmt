from django.db import models

class NewsLetter(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=60)
    date = models.DateField(auto_now_add=True)
    content = models.CharField(max_length=2000)

    def __str__(self):
        return self.title + " " + str(self.date)