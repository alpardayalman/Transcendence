from django.db import models
from django.contrib.auth.models import AbstractUser, User

# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)


class Message(models.Model):
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)

class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)