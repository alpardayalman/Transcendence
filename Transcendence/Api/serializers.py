from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from Chat.models import CustomUser
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

# eski profil serializer.
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
    

# ---------------------------------------------------------------------------------------------------------
    
# eski 2fa serializer


from rest_framework import serializers
from django.contrib.auth import authenticate
from Chat.models import CustomUser
from Display.forms import CreateUserForm

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        print("data= ", data)
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password) # eger sifresi dogru ise.
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                return user
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must provide both username and password.")
    



from Chat.models import CustomUser

class UserRegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'profile_photo']

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password1 = data.get('password1')
        password2 = data.get('password2')

        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")
        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        return data
