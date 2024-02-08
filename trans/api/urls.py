from django.urls import path
from .Profile import serializer

urlpatterns = [
    path('Profile/', serializer.ProfileGenericAPIView.as_view(), name='Profile'),
]