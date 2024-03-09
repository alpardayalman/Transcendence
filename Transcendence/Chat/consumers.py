from django.shortcuts import get_object_or_404
# from django.core.serializers import json
from asgiref.sync import sync_to_async, async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from Chat.models import Message, Room, CustomUser, BlockedUser
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # data = json.loads(text_data)
        # username = data['username']
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
            'message': 'Chat suck susfuly connect',
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
        print('receive', text_data)
        try:
            if text_data['action'] == 'pong_request':
                data = text_data
                username = data['username']
                friend = data['friend']
                update = data['update']
                await self.send(text_data=json.dumps({
                    'action': 'pong_request',
                    'username': username,
                    'friend': friend,
                    'update': update,
                }))
        except:
            print('dfgh')
            pass
        data = json.loads(text_data)
        action = data['action']
        if action == 'friend_request':
            username = data['username']
            friend = data['friend']
            res = True if await self.friend_add(username, friend) else False
            await self.send(text_data=json.dumps({
                'action': 'friend_request',
                'res': res,
                'username': username,
                'friend': friend,
            }))
        
        elif action == 'chat_message':
            print('chat_message if ', data)
            await self.save_message(data['msg'], data['from'], data['to'])
            # thats "group send" method for start the "chat_message" method with last argument
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat.message',
                    'msg': data['msg'],
                    'from': data['from'],
                    'to': data['to'],
                }
            )
        
        elif action == 'block_user':
            print('block_user elif', data)
            await self.block_user(data['user'], data['block'])
            await self.send(text_data=json.dumps({
                'action': 'block_user',
                'user': data['user'],
                'block': data['block'],
            }))
        
        elif action == 'unblock_user':
            print(f"UNBLOCK IF {data}")
            await self.unblock_user(data['user'], data['block'])
            await self.send(text_data=json.dumps({
                'action': 'unblock_user',
                'user': data['user'],
                'block': data['block'],
            }))



    async def chat_message(self, data):
        msg = data['msg']
        recv = data['from']
        send = data['to']
        print('chat_message', msg, recv, send)
        # msgDate = self.get_date(recv, send)
        # thats "send" method for send data to websocket
        await self.send(text_data=json.dumps({
            'action': 'chat_message',
            'msg': msg,
            'from': recv,
            'to': send,
        }))


    @sync_to_async
    def get_date(self, recv, send):
        return Message.objects.filter(user=CustomUser.objects.get(username=recv), friend=CustomUser.objects.get(username=send)).last().getDate()

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
    
    @sync_to_async
    def unfriend_user(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        if target is not None and user is not None:
            user.friends.remove(user)
    
    @sync_to_async
    def block_user(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        if not BlockedUser.objects.filter(user=user, blocked=target).exists():
            print(f"======== EXISTOS ========")
            block = BlockedUser.objects.create(user=user, blocked=target)
            user.blockeds.add(block)
            return
        print(f"======== NOT EXISTOS ========")
    
    @sync_to_async
    def unblock_user(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        if BlockedUser.objects.filter(user=user, blocked=target).exists():
            blocke = BlockedUser.objects.get(user=user, blocked=target)
            blocke.delete()