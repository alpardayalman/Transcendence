from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import GenericAPIView
from chat.models import CustomUser
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


class ProfileSerializer(ModelSerializer):
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    # is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'is_active')


class ProfileGenericAPIView(GenericAPIView):
    serializer_class = ProfileSerializer
    queryset = CustomUser.objects.all()

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        user = self.get_queryset().filter(username=request.user.username)
        seri = self.get_serializer(user, many=True).data
        return JsonResponse({'data': seri}, safe=False)