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
        print("Dev seri: ", request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
        return Response(serializer.data, status=200)

class MatchGetAPIView(APIView):
    def get(self, request, username, *args, **kwargs):
        try:
            user = CustomUser.objects.get(username=username)
            instance = Match.objects.filter(UserOne=user.id)[len(Match.objects.filter(UserOne=user.id))-5:]
            if instance.count() == 0:
                instance = Match.objects.filter(UserTwo=user.id)[len(Match.objects.filter(UserTwo=user.id))-5:]
        except Match.DoesNotExist:
            return Response({'status': '404 instance is not found.'})
        resp = { }
        isOneValid = 0
        n = instance.count() + 1
        for i in range(instance.count()):
            n = n - 1
            if instance[i].UserTwo == None:
                inst = {
                        f"UserOne-{n - 1}": userOne.username,
                        f"UserTwo-{n - 1}": "Guests",
                        f"ScoreOne-{n - 1}": serializer.data['ScoreOne'],
                        f"ScoreTwo-{n - 1}": serializer.data['ScoreTwo'],
                        f"Date-{n - 1}": serializer.data['Date']
                    }
                resp.update(inst)
                isOneValid = 1
                continue
            serializer = MatchGetSerializer(instance[i], data=request.data)
            if serializer.is_valid():
                userOne = CustomUser.objects.get(id=serializer.data['UserOne'])
                userTwo = CustomUser.objects.get(id=serializer.data['UserTwo'])
                inst = {
                    f"UserOne-{n - 1}": userOne.username,
                    f"UserTwo-{n - 1}": userTwo.username,
                    f"ScoreOne-{n - 1}": serializer.data['ScoreOne'],
                    f"ScoreTwo-{n - 1}": serializer.data['ScoreTwo'],
                    f"Date-{n - 1}": serializer.data['Date']
                }
                resp.update(inst)
                isOneValid = 1
                print(resp)
            else:
                break
        if isOneValid == 1:
            return Response({'status': True, 'data': json.dumps(resp)})
        return Response({'status': False, 'data': "ERROR"})