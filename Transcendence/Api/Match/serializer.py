from rest_framework.serializers import Serializer
from rest_framework import serializers
from .model import Match
from Chat.models import CustomUser

class UsernameSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ("username",)


class MatchYedekSerializer(serializers.Serializer):
    Winner = serializers.CharField()
    Loser = serializers.CharField()
    ScoreOne = serializers.IntegerField()
    ScoreTwo = serializers.IntegerField()
    Date = serializers.DateTimeField(read_only=True)

    def validate(self, attrs):
        if attrs['ScoreOne'] < 0 or attrs['ScoreTwo'] < 0:
            raise serializers.ValidationError("Score can not be negative")
        elif attrs['ScoreOne'] == attrs['ScoreTwo']:
            raise serializers.ValidationError("Score can not be equal")
        elif attrs['Winner'] == attrs['Loser']:
            raise serializers.ValidationError("Winner and Loser can not be same")
        elif not attrs['Winner'] == "guest":
            if CustomUser.objects.filter(username=attrs['Winner']).count() == 0:
                raise serializers.ValidationError("Winner does not exist")
        elif not attrs['Loser'] == "guest":
            if CustomUser.objects.filter(username=attrs['Loser']).count() == 0:
                raise serializers.ValidationError("Loser does not exist")
        return super().validate(attrs)
    
    def create(self, validated_data):
        if validated_data['Winner'] == "guest":
            guest, _ = CustomUser.objects.get_or_create(username="guest")
            if validated_data['Loser'] == "guest":
                return None
            else:
                Loser=CustomUser.objects.get(username=validated_data['Loser'])
                if validated_data['ScoreOne'] > validated_data['ScoreTwo']:
                    Winner=guest
                    Loser=Loser
                else:
                    Winner=Loser
                    Loser=guest
                return Match.objects.create(
                    Winner=Winner,
                    Loser=Loser,
                    ScoreOne=validated_data['ScoreOne'],
                    ScoreTwo=validated_data['ScoreTwo']
                )
        elif validated_data['Loser'] == "guest":
            pass
        else:
            userone=CustomUser.objects.get(username=validated_data['Winner'])
            usertwo=CustomUser.objects.get(username=validated_data['Loser'])
            if validated_data['ScoreOne'] > validated_data['ScoreTwo']:
                winn=userone
                lose=usertwo
            else:
                winn=usertwo
                lose=userone
            return Match.objects.create(
                Winner=winn,
                Loser=lose,
                ScoreOne=validated_data['ScoreOne'],
                ScoreTwo=validated_data['ScoreTwo']
            )

    # class Meta:
    #     model = Match

class MatchSerializer(serializers.ModelSerializer):
    Winner = UsernameSerializer()
    Loser = UsernameSerializer()
    ScoreOne = serializers.IntegerField()
    ScoreTwo = serializers.IntegerField()

    

    class Meta:
        model = Match
        fields = ("Winner", "Loser", "ScoreOne", "ScoreTwo",)
        validators = []