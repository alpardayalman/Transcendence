from rest_framework.serializers import Serializer
from rest_framework import serializers
from Chat.models import CustomUser
from Api.Pong.models import PongInvite

class PongInvitePostSerializer(Serializer):
    invite_id = serializers.CharField()
    invitee = serializers.CharField()
    invited = serializers.CharField()
    is_active = serializers.IntegerField(required=False, default=0)

    def validate(self, attrs):
        invite_id = attrs['invite_id']
        invitee = attrs['invitee']
        invited = attrs['invited']
        if invited == invitee:
            raise serializers.ValidationError('You cannot invite yourself.')
        if PongInvite.objects.filter(invite_id=invite_id).exists() :
            # raise serializers.ValidationError('You already invite anyone.')
            pass
        if not CustomUser.objects.filter(username=invitee).exists():
            raise serializers.ValidationError('Invitee does not exist.')
        if not CustomUser.objects.filter(username=invited).exists():
            raise serializers.ValidationError('Invited does not exist.')
        return super().validate(attrs)

    def create(self, validated_data):
        print("validated_data::",validated_data)
        invite_id = validated_data['invite_id']
        invitee = validated_data['invitee']
        invited = validated_data['invited']
        is_active = validated_data['is_active']
        return PongInvite.objects.create(
            invite_id = invite_id,
            invitee = invitee,
            invited = invited,
            is_active = is_active,
        )

class PongInviteGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongInvite
        fields = '__all__'
        read_only_fields = ('invite_id', 'invitee', 'invited', 'is_active')

class PongInvitePutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongInvite
        fields = ('invite_id', 'invitee', 'invited', 'is_active')

class PongInviteBozukSerializer(Serializer):
    invite_id = serializers.CharField()
    invitee = serializers.CharField()
    invited = serializers.CharField()
    is_active = serializers.IntegerField(required=True)

    def validate(self, attrs):
        invite_id = attrs['invite_id']
        invitee = attrs['invitee']
        invited = attrs['invited']
        # self.instance = PongInvite.objects.get(invite_id=invite_id, invited=invited, invitee=invitee)
        return super().validate(attrs)

    def update(self, instance, validated_data):
        # instance.is_activel = validated_data['is_active']
        return PongInvite.objects.get(**validated_data)

class PongInviteDeleteSerializer(Serializer):
    pass