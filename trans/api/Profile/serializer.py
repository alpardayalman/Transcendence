from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from chat.models import CustomUser
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

# profile user card serializer
class ProfileSerializer(ModelSerializer):
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name')


class ProfileGenericAPIView(GenericAPIView):
    serializer_class = ProfileSerializer
    queryset = CustomUser.objects.all()

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        user = self.get_queryset().filter(username=request.user.username)
        seri = self.get_serializer(user, many=True).data
        print(seri)
        return Response(seri)

# profile user score serializer
class ScoreSerializer(ModelSerializer):
    total_match = serializers.IntegerField()
    win = serializers.IntegerField()
    lose = serializers.IntegerField()
    draw = serializers.IntegerField()
    best_score = serializers.IntegerField()

    class Meta:
        model = CustomUser
        fields = ('total_match', 'win', 'lose', 'draw', 'best_score')

class ScoreGenericAPIView(GenericAPIView):
    serializer_class = ScoreSerializer
    queryset = CustomUser.objects.all()

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        user = self.get_queryset().filter(username=request.user.username)
        seri = self.get_serializer(user, many=True).data
        return Response(seri)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        user = self.get_queryset().filter(username=request.user.username).get()
        user.total_score = request.data['total_match']
        user.win = request.data['win']
        user.lose = request.data['lose']
        user.draw = request.data['draw']
        user.best_score = request.data['best_score']
        user.save()
        return Response({'status': 'OK'})