from rest_framework.serializers import Serializer
from rest_framework import serializers
from .model import Match
from Chat.models import CustomUser

class UsernameSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ("username",)


class MatchSerializer(serializers.ModelSerializer):
    Winner = UsernameSerializer()
    Loser = UsernameSerializer()

    def is_valid(self, data):
        print('a= ', data)
        wine = self.initial_data['Winner.username']
        print(wine)
        if wine == "ahmet":
            raise serializers.ValidationError("User is ahmet mfakirs")
        return wine

    # def create(self, validated_data):
    #     user_data = validated_data.pop('user')
    #     user, _ = CustomUser.objects.get_or_create(**user_data)
        

    class Meta:
        model = Match
        fields = ("Winner", "Loser", "ScoreOne", "ScoreTwo",)
        validators = []