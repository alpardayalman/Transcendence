from django.contrib import admin


from Api.models import AuthInfo
from Chat.models import Room, Message, CustomUser, BlockedUser, FriendRequest
from Api.Match.model import Match
from Api.Pong.models import PongInvite


# Api
admin.site.register(AuthInfo)

# Chat
admin.site.register(Room)
admin.site.register(Message)
admin.site.register(CustomUser)
admin.site.register(BlockedUser)
admin.site.register(FriendRequest)

# Match
admin.site.register(Match)

# Pong
admin.site.register(PongInvite)