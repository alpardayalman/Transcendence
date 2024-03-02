from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from Api.Pong.serializer import PongInviteSerializer, PongInviteGetSerializer
from Api.Pong.models import PongInvite

invite_json = {
    'invite_id': '123', # or who start the game 
    'invitee': 'tacikgoz',
    'invited': 'admin',
    'is_active': True,
}

class PongInviteCreateAPIView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        serializer = PongInviteSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'chat',
                {
                    'type': 'chat.message',
                    'from': data['invitee'],
                    'to': data['invited'],
                    'msg': 'pong_invite '+str(data['invite_id']),
                }
            )
            serializer.save()
            return Response({'status': True, 'data': data})
        return Response({'status': False, 'data': serializer.errors})

class PongInviteGetAPIView(APIView):
    def get(self, request, *args, **kwargs):
        invites = PongInvite.objects.all()
        serializer = PongInviteGetSerializer(invites, many=True)
        return Response(serializer.data)

# class MyModelDeleteView(APIView):
#     def delete(self, request, pk):
#         try:
#             model = MyModel.objects.get(pk=pk)
#             model.delete()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         except MyModel.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)