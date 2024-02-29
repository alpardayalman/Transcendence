from django.db.models import Model
from django.db import models
from Chat.models import CustomUser

class Match(Model):
    Winner = models.ForeignKey(CustomUser, related_name="Winner", on_delete=models.CASCADE)
    Loser = models.ForeignKey(CustomUser, related_name="Loser", on_delete=models.CASCADE)
    ScoreOne = models.IntegerField(default=0)
    ScoreTwo = models.IntegerField(default=0)
    Date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.Winner.username
    class Meta:
        ordering = ("Winner",)