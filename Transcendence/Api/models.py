from django.db import models
from Chat.models import CustomUser

class AuthInfo(models.Model):
    secret_key = models.CharField(max_length=100)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"AuthInfo - {self.user}"
