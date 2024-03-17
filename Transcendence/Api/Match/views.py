from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from Api.Match.model import Match
from Chat.models import CustomUser
from Api.Match.serializer import MatchGetSerializer, MatchPostSerializer
from rest_framework.permissions import IsAuthenticated
import json


class MatchPostAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MatchPostSerializer

    def get(self, request, *args, **kwargs):
        invites = Match.objects.all()
        serializer = MatchGetSerializer(invites, many=True)
        return Response({'status': True, 'data': serializer.data})

    def post(self, request, *args, **kwargs):
        serializer = MatchPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            scoreone = serializer.data['ScoreOne']
            scoretwo = serializer.data['ScoreTwo']
            UserOne = CustomUser.objects.get(username=serializer.data['UserOne'])
            if CustomUser.objects.filter(username=serializer.data['UserTwo']).exists():
                UserTwo = CustomUser.objects.get(username=serializer.data['UserTwo'])
                if scoreone > scoretwo:
                    UserOne.win += 1
                    UserTwo.lose += 1
                else:
                    UserOne.lose += 1
                    UserTwo.win += 1
                UserTwo.total_match += 1
                UserTwo.save()
            else:
                if scoreone > scoretwo:
                    UserOne.win += 1
                else:
                    UserOne.lose += 1
            UserOne.total_match += 1
            UserOne.save()

        else:
            return Response(serializer.errors, status=400)
        return Response(serializer.data, status=200)


class MatchGetAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, username, *args, **kwargs):
        try:
            user = CustomUser.objects.get(username=username)
            instance = Match.objects.filter(UserOne=user.id) | Match.objects.filter(UserTwo=user.id)
            instance = instance.order_by('-Date')

            instance = instance[0:5]
            if instance == None:
                return Response({'status': False, 'data': "ERROR"})
        except Match.DoesNotExist:
            return Response({'status': False, 'data': "ERROR"})
        resp = { }
        for i in range(len(instance)):
            inst = {
                f"UserOne-{i}": instance[i].UserOne.username,
                f"ScoreOne-{i}": instance[i].ScoreOne,
                f"ScoreTwo-{i}": instance[i].ScoreTwo,
                f"Date-{i}": instance[i].Date.strftime("%Y-%m-%d %H:%M:%S")
            }
            if instance[i].UserTwo:
                inst[f"UserTwo-{i}"] = instance[i].UserTwo.username
            else:
                inst[f"UserTwo-{i}"] = "Guest"
            resp.update(inst)

        return Response({'status': True, 'data': json.dumps(resp)})