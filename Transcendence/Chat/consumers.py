# from django.core.serializers import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from Chat.models import Message, CustomUser, BlockedUser
from Api.Pong.models import PongInvite
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
        
        elif action == 'sendMessage':
            print('chat_message if ', data)
            await self.save_message(data["message"], data["user"], data["friend"])
            # thats "group send" method for start the "chat_message" method with last argument
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat.message',
                    'message': data['message'],
                    'user': data['user'],
                    'friend': data['friend'],
                }
            )

# ============================ NEW CODE ============================
        elif action == 'getAllUsers':
            me = data['user']
            juso = {
                'action': 'getAllUsers',
                'user': me,
                'status': False,
            }
            users = await self.getAllUsers(me)
            if len(users) > 0:
                juso['status'] = True
                juso['users'] = users
            await self.send(text_data=json.dumps(juso))

        elif action == 'getNotFriends':
            me = data['user']
            juso = {
                'action': 'getNotFriends',
                'user': me,
                'status': False,
            }
            users = await self.getNotFriends(me)
            if len(users) > 0:
                juso['status'] = True
                juso['notFriends'] = users
            await self.send(text_data=json.dumps(juso))

        elif action == 'getFriends':
            me = data['user']
            juso = {
                'action': 'getFriends',
                'user': me,
                'status': False,
            }
            users = await self.getFriends(me)
            if len(users) > 0:
                juso['status'] = True
                juso['friends'] = users
            await self.send(text_data=json.dumps(juso))

        elif action == 'getBlockeds':
            me = data['user']
            juso = {
                'action': 'getBlockeds',
                'user': me,
                'status': False,
            }
            users = await self.getBlockeds(me)
            if len(users) > 0:
                juso['status'] = True
                juso['blockeds'] = users
            await self.send(text_data=json.dumps(juso))
        
        elif action == 'getMessage':
            me = data['user']
            friend = data['friend']
            juso = {
                'action': 'getMessage',
                'user': me,
                'friend': friend,
                'status': False,
            }
            messages = await self.getMessage(me, friend)
            if len(messages) > 0:
                juso['status'] = True
                juso['messages'] = messages
            await self.send(text_data=json.dumps(juso))
        elif action == 'pongInviteReturn':
            print('pongInviteReturn===', data)
            await self.pongInvitePut(data)

    @sync_to_async
    def getAllUsers(self, username):
        if username is not None:
            allUser = []
            users = CustomUser.objects.all()
            for u in users:
                if u.username is not username:
                    allUser.append(u.username)
            return allUser
        else:
            return []
    
    @sync_to_async
    def getNotFriends(self, username):
        if username is not None:
            allUser = []
            users = CustomUser.objects.all()
            for u in users:
                if u.username is not username and not u in CustomUser.objects.get(username=username).friends.all():
                    allUser.append(u.username)
            return allUser
        else:
            return []
    
    @sync_to_async
    def getFriends(self, username):
        if username is not None:
            allUser = []
            users = CustomUser.objects.get(username=username).friends.all()
            for u in users:
                if not u.username == username:
                    allUser.append(u.username)
            return allUser
        else:
            return []

    @sync_to_async
    def getBlockeds(self, username):
        if username is not None:
            allUser = []
            users = CustomUser.objects.get(username=username).blockeds.all()
            for u in users:
                allUser.append(u.blocked.username)
            return allUser
        else:
            return []

    @sync_to_async
    def getMessage(self, username, friend):
        if username is not None and friend is not None:
            user = CustomUser.objects.get(username=username)
            friend = CustomUser.objects.get(username=friend)
            messages = Message.objects.filter(user=user, friend=friend)
            messages = messages | Message.objects.filter(user=friend, friend=user)
            allMessages = []
            for message in messages:
                allMessages.append({
                    'user': message.user.username,
                    'friend': message.friend.username,
                    'content': message.content,
                    'date': message.getDate(),
                })
        return allMessages
    
    @sync_to_async
    def pongInvitePut(self, data):
        print('pongInvitePut===', data)
        username = data['username']
        friend = data['friend']
        update = data['update']
        invite = PongInvite.objects.get(invitee=username, invited=friend)
        invite.is_active = update
        print("invite.is_active", invite.is_active)
        return True
    
    async def pongInvite(self, data):
        await self.send(text_data=json.dumps({
            'action': 'pongInvite',
            'username': data['username'],
            'friend': data['friend'],
            'update': data['update'],
        }))

# ============================ NEW CODE ============================

    async def chat_message(self, data):
        msg = data['message']
        recv = data['user']
        send = data['friend']
        print('chat_message', msg, recv, send)
        await self.send(text_data=json.dumps({
            'action': 'sendMessage',
            'user': recv,
            'friend': send,
            'status': True,
        }))


    @sync_to_async
    def get_date(self, recv, send):
        return Message.objects.filter(user=CustomUser.objects.get(username=recv), friend=CustomUser.objects.get(username=send)).last().getDate()

    @sync_to_async
    def save_message(self, message, username, friendname):
        user = CustomUser.objects.get(username=username)
        friend = CustomUser.objects.get(username=friendname)
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