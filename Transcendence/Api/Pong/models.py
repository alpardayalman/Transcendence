from django.db import models

class PongInvite(models.Model):
    invite_id = models.CharField(max_length=100)
    invitee = models.CharField(max_length=100)
    invited = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.invite_id