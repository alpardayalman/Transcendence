from django.urls import path
from .Profile import serializer

urlpatterns = [
    path('profile/', serializer.ProfileGenericAPIView.as_view(), name='Profile'),
    path('score/', serializer.ScoreGenericAPIView.as_view(), name='Score'),
]