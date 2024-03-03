from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from Api.Pong.serializer import PongInvitePostSerializer, PongInviteGetSerializer, PongInvitePutSerializer
from Api.Pong.models import PongInvite
import json

invite_json = {
    'invite_id': '123', # or who start the game
    'invitee': 'tacikgoz',
    'invited': 'admin',
    'is_active': 0,#'accepted' 'declined', 'pending'
}
invite_json = {
    "invite_id": "123",
    "invitee": "tacikgoz",
    "invited": "admin",
    "is_active": 0
}

class PongInviteCreateAPIView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        serializer = PongInvitePostSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            channel_layer = get_channel_layer()
            message = dict({
                'type': 'receive',
                'action': 'pong_request',
                'username': data['invitee'],
                'friend': data['invited'],
                'update': 'pong_invite ',
            })
            async_to_sync(channel_layer.group_send)(
                'chat',
                message
            )
            serializer.save()
            return Response({'status': True, 'data': data})
        return Response({'status': False, 'data': serializer.errors})

class PongInviteGetAPIView(APIView):
    def get(self, request, inv_id, *args, **kwargs):
        
        try:
            instance = PongInvite.objects.get(invite_id=inv_id)
        except PongInvite.DoesNotExist:
            return Response({'status':'404 instance not found.'})
        
        serializer = PongInviteGetSerializer(instance, data=request.data)
        if serializer.is_valid():
            return Response({"status": True, "data": serializer.data})
        else:
            return Response({"status": False, "data": serializer.errors})


class PongInviteUpdateAPIView(APIView):
    def put(self, request, *args, **kwargs):
        inv_id = request.data['invite_id']
        try:
            instance = PongInvite.objects.get(invite_id=inv_id)
        except PongInvite.DoesNotExist:
            return Response({'status':'404 instance not found.'})
        
        serializer = PongInvitePutSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': True, 'data': serializer.data})
        else:
            return Response({'status': False, 'data': serializer.errors})

    def get(self, request, *args, **kwargs):
        invites = PongInvite.objects.all()
        serializer = PongInviteGetSerializer(invites, many=True)
        return Response({'status': True, 'data': serializer.data})