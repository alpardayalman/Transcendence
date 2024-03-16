from django.db.models import Model
from django.db import models
from Chat.models import CustomUser

class Match(Model):
    UserOne = models.ForeignKey(CustomUser, related_name="UserOne", on_delete=models.CASCADE, default=None)
    UserTwo = models.ForeignKey(CustomUser, related_name="UserTwo", on_delete=models.CASCADE, default=None, null=True, blank=True)
    ScoreOne = models.IntegerField(default=0)
    ScoreTwo = models.IntegerField(default=0)
    Date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.UserOne.username

    class Meta:
        ordering = ("UserOne",)