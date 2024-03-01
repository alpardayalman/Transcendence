from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from .serializer import MatchGetSerializer, MatchPostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .model import Match
from Chat.models import CustomUser

class MatchListAPIView(ListAPIView):
    serializer_class = MatchPostSerializer
    # queryset = Match.objects.all()

    def get(self, request, *args, **kwargs):
        user = CustomUser.objects.get(username=request.user)
        instance = Match.objects.filter(UserOne=user).last()
        serializer = MatchGetSerializer(instance)
        return Response(serializer.data, status=200)

    def post(self, request, *args, **kwargs):
        serializer = MatchPostSerializer(data=request.data)
        if serializer.is_valid():
            print('valid ', serializer.validated_data)
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
        return Response(serializer.data, status=200)
