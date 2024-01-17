import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync

from .models import Message, Room, CustomUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'chat'
        # we dont need to define any name for room 
        # because channels do it for us
        self.room_group_name = 'chat'
        # chanel_name and room_group_name are same
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'websocket.connect',
            'message': 'suck susfuly connected',
        }))


    async def disconnect(self, close_code):
        await self.send(text_data=json.dumps({
            'type': 'websocket.disconnect',
            'close_code': close_code,
        }))
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        print('receive')
        data = json.loads(text_data)
        action = data['action']
        if action == 'chat_message':
            print('chat_message if ', data)
            await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'msg': data['msg'],
                'from': data['from'],
                'to': data['to'],
            }
        )

        elif action == 'friend_request':
            username = data['username']
            target = data['target']
            self.friend_add(self, username, target)
            self.send(text_data=json.dumps({
                'type': 'friend_request',
                'msg': 'friend request sent',
            }))

    async def chat_message(self, data):
        msg = data['msg']
        recv = data['from']
        send = data['to']
        # thats data come from websocket
        print('chat_message', msg, recv, send)
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'msg': msg,
            'from': recv,
            'to': send,
        }))
        self.save_message(msg, recv, send)

    @sync_to_async
    def save_message(self, message, username, friend):
        user = CustomUser.objects.get(username=username)
        friend = CustomUser.objects.get(username=friend)
        Message.objects.create(user=user, friend=friend, content=message)

    @sync_to_async
    def friend_add(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        userall = CustomUser.objects.all()
        if target is not None and target in userall:
            if not (target in CustomUser.objects.get(username=username).friends.all()):
                CustomUser.objects.get(username=username).friends.add(target)
                return True
        return False