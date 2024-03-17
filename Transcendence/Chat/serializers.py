from Chat.models import CustomUser
from django.http import JsonResponse
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import GenericAPIView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

# eski chat serializer
class FriendBlockedSerializer(ModelSerializer):
    username = serializers.CharField(read_only=True)
    friend = serializers.StringRelatedField(many=True)
    blockeds = serializers.StringRelatedField(many=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'blockeds')


class UserGenericAPIView(GenericAPIView):
    serializer_class = FriendBlockedSerializer
    queryset = CustomUser.objects.all()

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        return JsonResponse({'data': self.serializer_class(self.get_queryset().filter(username=request.user.username), many=True).data}, safe=False)
    

