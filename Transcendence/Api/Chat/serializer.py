from rest_framework import serializers
from Chat.models import BlockedUser, CustomUser

class UserBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedUser
        fields = ('user', 'blocked')

    def validate(self, attrs):
        return attrs
    
    def create(self, validated_data):
        user = CustomUser.objects.get(username=self.initial_data['username'])
        blocked = CustomUser.objects.get(username=self.initial_data['block'])
        if (self.initial_data['username'] == self.initial_data['block']):
            raise serializers.ValidationError("You can't block yourself")
        if BlockedUser.objects.filter(user=user, blocked=blocked).exists():
            raise serializers.ValidationError("You already have instance of this BlockedUser")
        return BlockedUser.objects.create(user=user, blocked=blocked)
