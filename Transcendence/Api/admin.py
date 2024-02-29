from django.contrib import admin

# Register your models here.

from Display.models import YourModel
from Api.models import AuthInfo
from Chat.models import Room, Message, CustomUser, BlockedUser
from .Match.model import Match

# Display
admin.site.register(YourModel)

# Api
admin.site.register(AuthInfo)

# Chat
admin.site.register(Room)
admin.site.register(Message)
admin.site.register(CustomUser)
admin.site.register(BlockedUser)

# Match
admin.site.register(Match)