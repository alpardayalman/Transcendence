import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from .models import Message, Room, CustomUser
# from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print('receive')
        data = json.loads(text_data)
        action = data['action']
        if action == 'friend-request':
            target = data['target']
            username = data['username']
            res = await self.friend_add(username, target)
            return await self.send(text_data=json.dumps({
                'action': action,
                'result': res,
                'target': target,
            }))

        elif action == 'chat-message':
            message = data['message']
            username = data['username']
            room = data['room']
            friend = data['friend']
            await self.save_message(message, username, room, friend)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                    'room': room,
                    'friend': friend,
                }
            )
    
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        room = event['room']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'room': room,
        }))

    @sync_to_async
    def save_message(self, message, username, room, friend):
        user = CustomUser.objects.get(username=username)
        room = Room.objects.get(name=room)
        print(friend)
        friend = CustomUser.objects.get(username=friend)
        Message.objects.create(room=room, user=user, friend=friend, content=message)

    @sync_to_async
    def friend_add(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        userall = CustomUser.objects.all()
        if target is not None and target in userall:
            if not (target in CustomUser.objects.get(username=username).friends.all()):
                CustomUser.objects.get(username=username).friends.add(target)
                return True
        return False