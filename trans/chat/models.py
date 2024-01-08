from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    friends = models.ManyToManyField("self", blank=True, symmetrical=False)

class Room(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)


class Message(models.Model):
    user = models.ForeignKey(CustomUser, related_name='user', on_delete=models.CASCADE, null=True)
    friend = models.ForeignKey(CustomUser, related_name='friend', on_delete=models.CASCADE, null=True)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)

