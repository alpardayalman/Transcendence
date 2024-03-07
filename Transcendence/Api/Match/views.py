from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from Api.Match.model import Match
from Chat.models import CustomUser
from Api.Match.serializer import MatchGetSerializer, MatchPostSerializer, UsernameSerializer
import json

class MatchPostAPIView(APIView):
    serializer_class = MatchPostSerializer
    # queryset = Match.objects.all()

    def get(self, request, *args, **kwargs):
        invites = Match.objects.all()
        serializer = MatchGetSerializer(invites, many=True)
        return Response({'status': True, 'data': serializer.data})

    def post(self, request, *args, **kwargs):
        serializer = MatchPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
        return Response(serializer.data, status=200)

class MatchGetAPIView(APIView):
    def get(self, request, username, *args, **kwargs):
        try:
            user = CustomUser.objects.get(username=username)
            instance = Match.objects.get(UserOne=user.id)
        except Match.DoesNotExist:
            return Response({'status': '404 instance is not found.'})
        
        serializer = MatchGetSerializer(instance, data=request.data)
        if serializer.is_valid():
            userOne = CustomUser.objects.get(id=serializer.data['UserOne'])
            userTwo = CustomUser.objects.get(id=serializer.data['UserTwo'])
            resp = {
                "UserOne": userOne.username,
                "UserTwo": userTwo.username,
                "ScoreOne": serializer.data['ScoreOne'],
                "ScoreTwo": serializer.data['ScoreTwo'],
                "Date": serializer.data['Date']
            }
            print(serializer.data)
            return Response({'status': True, 'data': json.dumps(resp)})
        return Response({'status': False, 'data': serializer.errors})