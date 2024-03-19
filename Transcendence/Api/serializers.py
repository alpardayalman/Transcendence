from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from Chat.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
import re 
from django.core.validators import EmailValidator

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
    



class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                return user
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must provide both username and password.")
    

class UserRegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    email = serializers.EmailField()

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password1 = data.get('password1')
        password2 = data.get('password2')

        if email.count('@') > 1 or email.count('.') > 1:
            raise serializers.ValidationError("Invalid email address.")
        if any(char in '!#$%^&*()=[]{};:\'"\\|,<>/?`~' for char in email):
            raise serializers.ValidationError("Invalid email address.")
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise serializers.ValidationError("Username must contain only alphanumeric characters and underscores.")
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")
        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")
        if len(password1) < 8:
            raise serializers.ValidationError("Password must be longer than 8 characters.")
        if not any(char.isupper() for char in password1):
            raise serializers.ValidationError("Password must contain an uppercase letter.")
        if not any(char.islower() for char in password1):
            raise serializers.ValidationError("Password must contain a lowercase letter.")
        if not any(char.isdigit() for char in password1):
            raise serializers.ValidationError("Password must contain a number.")
        if not any(char in '!@#$%^&*()_+-=[]{};:\'"\\|,.<>/?`~' for char in password1):
            raise serializers.ValidationError("Password must contain a special character.")


        return data
