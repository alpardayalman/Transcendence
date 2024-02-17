from rest_framework import serializers
from django.contrib.auth import authenticate
from chat.models import CustomUser
from S_A_P.forms import CreateUserForm

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
    


class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        password1 = data.get('password1')
        password2 = data.get('password2')

        if (CustomUser.objects.filter(username=username).exists()):
            raise serializers.ValidationError("Username already exists.")
        if (CustomUser.objects.filter(email=email).exists()):  
            raise serializers.ValidationError("Email already exists.")
        if (password1 != password2):    
            raise serializers.ValidationError("Passwords do not match.")
        else:
            return data

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2'] 

