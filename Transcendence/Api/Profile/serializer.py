from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from Chat.models import CustomUser
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

class ProfileSerializer(ModelSerializer):

    class Meta:
        model = CustomUser
        exclude = ('password', 'is_active', "is_superuser", "user_permissions", "is_staff", "jwt_secret", "groups")