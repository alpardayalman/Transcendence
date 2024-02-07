from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    friends = models.ManyToManyField("self", blank=True, symmetrical=False, related_name='friend')
    blockeds = models.ManyToManyField("BlockedUser", blank=True, symmetrical=False, related_name='blockeds')

    def get_friends_name(self):
        return self.friends.all().values_list(flat=True)

    class Meta:
        ordering = ('username',)


class Room(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)


class Message(models.Model):
    user = models.ForeignKey(CustomUser, related_name='whoSend', on_delete=models.CASCADE, null=True)
    friend = models.ForeignKey(CustomUser, related_name='whoRecv', on_delete=models.CASCADE, null=True)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)


class BlockedUser(models.Model):
    user = models.ForeignKey(CustomUser, related_name='whoBlock', on_delete=models.CASCADE, null=True)
    blocked = models.ForeignKey(CustomUser, related_name='whoBlocked', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.blocked.username)
    
    class Meta:
        ordering = ('blocked',)

