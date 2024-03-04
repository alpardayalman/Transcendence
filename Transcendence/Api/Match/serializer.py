from rest_framework.serializers import Serializer
from rest_framework import serializers
from .model import Match
from Chat.models import CustomUser

class UsernameSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ("username",)


class MatchPostSerializer(serializers.Serializer):
    UserOne = serializers.CharField()
    UserTwo = serializers.CharField()
    ScoreOne = serializers.IntegerField()
    ScoreTwo = serializers.IntegerField()
    Date = serializers.DateTimeField(read_only=True)

    def validate(self, attrs):
        if attrs['ScoreOne'] < 0 or attrs['ScoreTwo'] < 0:
            raise serializers.ValidationError("Score can not be negative")
        elif attrs['ScoreOne'] == attrs['ScoreTwo']:
            raise serializers.ValidationError("Score can not be equal")
        elif attrs['UserOne'] == attrs['UserTwo']:
            raise serializers.ValidationError("UserOne and UserTwo can not be same")
        elif not attrs['UserOne'] == "guest":
            if CustomUser.objects.filter(username=attrs['UserOne']).count() == 0:
                raise serializers.ValidationError("UserOne does not exist")
        elif not attrs['UserTwo'] == "guest":
            if CustomUser.objects.filter(username=attrs['UserTwo']).count() == 0:
                raise serializers.ValidationError("UserTwo does not exist")
        return super().validate(attrs)
    
    def create(self, validated_data):
        scoreone = validated_data['ScoreOne']
        scoretwo = validated_data['ScoreTwo']
        userone = validated_data['UserOne']
        usertwo = validated_data['UserTwo']
        if userone == "guest":
            if not usertwo == "guest":
                usertwo = CustomUser.objects.get(username=usertwo)
                return Match.objects.create(
                    UserOne=None,
                    UserTwo=usertwo,
                    ScoreOne=scoreone,
                    ScoreTwo=scoretwo
                )
        elif usertwo == "guest":
            if not userone == "guest":
                userone = CustomUser.objects.get(username=userone)
                return Match.objects.create(
                    UserOne=userone,
                    UserTwo=None,
                    ScoreOne=scoreone,
                    ScoreTwo=scoretwo
                )
        elif (not userone == "guest") and (not usertwo == "guest"):
            userone=CustomUser.objects.get(username=userone)
            usertwo=CustomUser.objects.get(username=usertwo)
            return Match.objects.create(
                UserOne=userone,
                UserTwo=usertwo,
                ScoreOne=scoreone,
                ScoreTwo=scoretwo
            )
        else:
            raise serializers.ValidationError("Creation error.")

    # class Meta:
    #     model = Match

class MatchGetSerializer(serializers.ModelSerializer):
    UserOne = UsernameSerializer()
    UserTwo = UsernameSerializer()

    class Meta:
        model = Match
        fields = ("id", "UserOne", "UserTwo", "ScoreOne", "ScoreTwo",)
        validators = []