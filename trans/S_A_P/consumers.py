import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync

from chat.models import CustomUser

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'game'
        self.room_group_name = 'game'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'websocket.connect',
            'message': 'suck susfuly connect',
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
        data = json.loads(text_data)
        action = data['action']
        if action == 'game_request':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game.request',
                    'username': data['username'],
                    'opponent': data['opponent'],
                }
            )
        
    async def game_request(self, event):
        print('game_request')
        username = event['username']
        opponent = event['opponent']
        await self.send(text_data=json.dumps({
            'action': 'game_request',
            'username': username,
            'opponent': opponent,
        }))