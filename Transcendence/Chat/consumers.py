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
            print(f'socket recieve is not pong request.')
            pass
        data = json.loads(text_data)
        action = data['action']

        if action == 'friend_request':
            username = data['user']
            friend = data['friend']
            res = False
            juso = {
                'action': 'friend_request',
                'user': username,
                'friend': friend,
                'status': res,
            }
            if await self.isUserAlreadyFriend(username, friend):
                juso['status'] = False
                juso['error'] = 'user is already friend'
            elif await self.isUserBlocked(username, friend):
                juso['status'] = False
                juso['error'] = 'user is blocked'
            else:
                juso['status'] = True
                await self.friend_add(username, friend)
            await self.send(text_data=json.dumps(juso))
        
        elif action == 'block_user':
            juso = {
                'action': 'block_user',
                'user': data['user'],
                'block': data['block'],
                'status': False,
            }
            print('block_user elif', data)
            if await self.isUserBlocked(data['user'], data['block']):
                juso['status'] = False
                juso['error'] = 'user is already blocked'
            else:
                if await self.isUserAlreadyFriend(data['user'], data['block']):
                    juso['alert'] = "unfriend"
                    await self.unfriend_user(data['user'], data['block'])
                await self.block_user(data['user'], data['block'])
                juso['status'] = True
            await self.send(text_data=json.dumps(juso))
        
        elif action == 'unblock_user':
            print(f"UNBLOCK IF {data}")
            await self.unblock_user(data['user'], data['block'])
            await self.send(text_data=json.dumps({
                'action': 'unblock_user',
                'user': data['user'],
                'block': data['block'],
            }))
        
        elif action == 'unfriend_user':
            print(f"UNFRIEND IF {data}")
            output = await self.unfriend_user(data['user'], data['friend'])
            print(f"UNFRIEND IF {output}")
        
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

    async def chat_message(self, data):
        Msg = data['msg']
        From = data['from']
        To = data['to']
        juso = {
            'action': 'chat_message',
            'msg': Msg,
            'from': From,
            'to': To,
            'status': False,
        }
        if (await self.isUserAlreadyFriend(To, From)) and not (await self.isUserBlocked(To, From)):
            print('chat_message', Msg, From, To)
            juso['status'] = True
            await self.send(text_data=json.dumps(juso))
        else:
            juso['msg'] = 'You are not friend or he/she blocked you.'
            juso['error'] = 'You are not friend or he/she blocked you.'
            await self.send(text_data=json.dumps(juso))


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
        friend = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        if friend is None and user is None:
            print(f"======== Friend Not EXISTOS ========")
            return False
        print(f"======== Friend EXISTOS instance ========")
        if friend in user.friends.all():
            user.friends.remove(friend)
            print(f"======== Friend remove True ======== {user.friends.all()} {friend} {user} {target} {username} {friend}")
            return True
        else:
            print(f"======== Friend remove False ========{user.friends.all()} {friend} {user} {target} {username} {friend}")
            return False
    
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
    
    @sync_to_async
    def isUserAlreadyFriend(self, username, friendname):
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        friend = (CustomUser.objects.get(username=friendname) if CustomUser.objects.filter(username=friendname).exists() else None)
        if user is not None and friend is not None:
            if friend in user.friends.all():
                print(f"isFriend True")
                return True
            else:
                print(f"isFriend False")
                return False
    
    @sync_to_async
    def isUserBlocked(self, username, target):
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        if user is None or target is None:
            return False
        if BlockedUser.objects.filter(user=user, blocked=target).exists():
            print(f"isBlockeds True")
            return True
        else:
            print(f"isBlockeds False")
            return False