from django.db import models
from django.utils import timezone

# Create your models here.
class YourModel(models.Model):
    field1 = models.CharField(max_length=100, default="HELLO")
    field2 = models.TextField()
    field3 = models.IntegerField()
    field4 = models.BooleanField(default=False)
    PRIORITIES = (
    (0, 'Low'),
    (1, 'Normal'),
    (2, 'High'),
    )
    priority = models.IntegerField(default=0, choices=PRIORITIES)
    field6 = models.DateTimeField(default=timezone.now, editable=True)
    email = models.EmailField(max_length=254, default="")

    def __str__(self):
        return self.field2