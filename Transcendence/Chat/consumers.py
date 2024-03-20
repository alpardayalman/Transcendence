# from django.core.serializers import json
from django.shortcuts import get_object_or_404
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from Chat.models import Message, CustomUser, BlockedUser, FriendRequest
from Api.Pong.models import PongInvite
import json


class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.room_name = 'chat'
        self.room_group_name = 'chat'
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

        if action == 'friendRequest':
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
        
        elif action == 'blockUser':
            juso = {
                'action': 'blockUser',
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
        
        elif action == 'unblockUser':
            print(f"UNBLOCK IF {data}")
            status = await self.unblock_user(data['user'], data['unBlock'])
            await self.send(text_data=json.dumps({
                'action': 'unblockUser',
                'user': data['user'],
                'unBlock': data['unBlock'],
                'status': status,
            }))
        
        elif action == 'unfriend_user':
            print(f"UNFRIEND IF {data}")
            output = await self.unfriend_user(data['user'], data['friend'])
            print(f"UNFRIEND IF {output}")
        
        elif action == 'sendMessage':
            print('chat_message if ', data)
            status = await self.isUserBlocked(data['user'], data['friend'])
            if not status:
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
            else:
                self.send(text_data=json.dumps({
                    'action': 'sendMessage',
                    'user': data['user'],
                    'friend': data['friend'],
                    'status': False,
                    'error': 'user is blocked',
                }))

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
            print('getNotFriends', data)
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
            if (len(users) == 0):
                juso['status'] = True
                juso['friends'] = ""
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
            elif len(users) == 0:
                juso['status'] = True
                juso['blockeds'] = ""
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
                print('getMessage', messages)
            await self.send(text_data=json.dumps(juso))
        elif action == 'pongInviteReturn':
            await self.pongInvitePut(data)
        elif action == 'sendFriendRequest':
            username = data['sender']
            friendname = data['receiver']
            juso = {
                "action": "sendFriendRequest",
                "sender": username,
                "receiver": friendname,
                "status": False,
            }
            status = await self.sendFriendRequest(username, friendname)
            if status:
                juso['status'] = True
            else:
                juso['status'] = False
            await self.send(text_data=json.dumps(juso))
        elif action == 'friendRequestPut':
            username = data['user']
            friendname = data['friend']
            requestStatus = data['requestStatus']
            juso = {
                "action": "friendRequestPut",
                "user": username,
                "friend": friendname,
                "requestStatus": "failed",
            }
            status = await self.sendFriendRequestPut(username, friendname, requestStatus)
            juso['requestStatus'] = status
            await self.send(text_data=json.dumps(juso))
        elif action == 'getFriendReqeusts':
            username = data['user']
            juso = {
                "action": "getFriendReqeusts",
                "user": username,
                "status": False,
            }
            requests = await self.getFriendReqeusts(username)
            if not requests == []:
                juso['status'] = True
                juso['requests'] = requests
            if requests == []:
                juso['status'] = True
                juso['requests'] = ""
            await self.send(text_data=json.dumps(juso))

    @sync_to_async
    def sendFriendRequestPut(self, username, friendname, requestStatus):
        user = CustomUser.objects.get(username=username)
        friend = CustomUser.objects.get(username=friendname)
        if (not user == None and not friend == None):
            if (requestStatus == True and (FriendRequest.objects.filter(sender=user, receiver=friend).exists() and self.isUserAlreadyFriend(friendname, username))):
                print('requestStatus', requestStatus, friendname, username, user, friend)
                request = FriendRequest.objects.get(sender=user, receiver=friend)
                print('request', request)
                if request:
                    user.friends.add(friend)
                    friend.friends.add(user)
                    request.delete()
                    return "accepted"
                else:
                    return "failed"
            elif (requestStatus == False and (FriendRequest.objects.filter(sender=user, receiver=friend).exists() and self.isUserAlreadyFriend(friendname, username))):
                request = FriendRequest.objects.get(sender=friend, receiver=user)
                if request.exists():
                    request.delete()
                    return "rejected"
                else:
                    return "failed"
        return "failed"
    @sync_to_async
    def sendFriendRequest(self, username, friendname):
        sender = CustomUser.objects.get(username=username)
        receiver = CustomUser.objects.get(username=friendname)
        if (sender == None) or (receiver == None):
            return False
        if (not FriendRequest.objects.filter(sender=sender, receiver=receiver).exists()):
            FriendRequest.objects.create(sender=sender, receiver=receiver)
            return True
        return False

    @sync_to_async
    def getFriendReqeusts(self, username):
        user = CustomUser.objects.get(username=username)
        if (not user == None):
            allRequest = []
            requests = FriendRequest.objects.filter(receiver=user)
            if requests == None:
                return []
            for r in requests:
                allRequest.append(
                    r.sender.username,
                )
            if (not requests == None):
                return allRequest
        return []

    @sync_to_async
    def isHasFriendRequest(self, sender, receiver):
        if (not sender == None) and (not receiver == None):
            request = FriendRequest.objects.filter(sender=sender, receiver=receiver)
            print('isHasFriendRequest', request)
            if request.exists():
                return False
            else:
                return True

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
            requests = FriendRequest.objects.filter(sender=CustomUser.objects.get(username=username))
            for u in users:
                status = True
                for r in requests:
                    if r.receiver.username == u.username:
                        status = False
                if u.username is not username and not u in CustomUser.objects.get(username=username).friends.all() and status:
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
        invite = PongInvite.objects.filter(invitee=username, invited=friend).last()
        print('invite===', invite)
        if invite is not None:
            invite.is_active = update
            invite.save()
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
            'message': msg,
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
            return False
        if friend in user.friends.all():
            user.friends.remove(friend)
            return True
        else:
            return False
    
    @sync_to_async
    def block_user(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        if not BlockedUser.objects.filter(user=user, blocked=target).exists():
            block = BlockedUser.objects.create(user=user, blocked=target)
            user.blockeds.add(block)
            return
    
    @sync_to_async
    def unblock_user(self, username, target):
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        if target is None or user is None:
            return False
        if BlockedUser.objects.filter(user=user, blocked=target).exists():
            blocke = BlockedUser.objects.get(user=user, blocked=target)
            blocke.delete()
            return True
        else:
            return False
    
    @sync_to_async
    def isUserAlreadyFriend(self, username, friendname):
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        friend = (CustomUser.objects.get(username=friendname) if CustomUser.objects.filter(username=friendname).exists() else None)
        if user is not None and friend is not None:
            if friend in user.friends.all():
                return True
            else:
                return False
    
    @sync_to_async
    def isUserBlocked(self, username, target):
        user = (CustomUser.objects.get(username=username) if CustomUser.objects.filter(username=username).exists() else None)
        target = (CustomUser.objects.get(username=target) if CustomUser.objects.filter(username=target).exists() else None)
        if user is None or target is None:
            return False
        if BlockedUser.objects.filter(user=user, blocked=target).exists():
            return True
        else:
            return False