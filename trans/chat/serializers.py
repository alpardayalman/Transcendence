from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    friends = serializers.StringRelatedField(many=True)
    blockeds = serializers.StringRelatedField(many=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'friends', 'blockeds')

