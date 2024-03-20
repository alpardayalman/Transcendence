from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
# Create your models here.

class CustomUser(AbstractUser):
    friends = models.ManyToManyField("self", blank=True, symmetrical=False, related_name='friend')
    blockeds = models.ManyToManyField("BlockedUser", blank=True, symmetrical=False, related_name='blockeds')
    is_2fa_enabled = models.BooleanField(default=False)
    jwt_secret = models.CharField(max_length=100, default='')
    
    total_match = models.IntegerField(default=0)
    win = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)
    bio = models.TextField(default='Bio not set yet.')
    online_status = models.BooleanField(default=False)
    is_42_student = models.BooleanField(default=False)

    LANGUAGES = {
        ('EN', 'English'),
        ('TR', 'Turkish'),
        ('FR', 'French'),
    }

    language = models.CharField(max_length=2, choices=LANGUAGES, default='EN')

    #profile photo
    def where_to_upload(self,filename):
        return f'profile_pictures/{self.username}/{filename}'

    profile_picture = models.ImageField(upload_to=where_to_upload, default="default/default.jpg")

    def get_friends_name(self):
        return self.friends.all().values_list(flat=True)
    
    def get_token(self):
        refresh = RefreshToken.for_user(self)
        return ({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })

    def __str__(self):
        return self.username
    

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

    def getDate(self):
        return self.date_added.date().__str__()

    class Meta:
        ordering = ('date_added',)


class BlockedUser(models.Model):
    user = models.ForeignKey(CustomUser, related_name='whoBlock', on_delete=models.CASCADE, null=True)
    blocked = models.ForeignKey(CustomUser, related_name='whoBlocked', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.blocked.username)
    
    class Meta:
        ordering = ('blocked',)

class FriendRequest(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='whoSendRequest', on_delete=models.CASCADE, null=True)
    receiver = models.ForeignKey(CustomUser, related_name='whoRecvRequest', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.sender.username)

    class Meta:
        ordering = ('sender',)  

