from django.urls import path
from Chat.serializers import UserGenericAPIView


urlpatterns = [
    path('userview/', UserGenericAPIView.as_view(), name='userview'),
]