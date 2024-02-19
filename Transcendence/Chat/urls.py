from django.urls import path
# from hat.api import view
from Chat.views import rooms, chat_js
from Chat.serializers import UserGenericAPIView

#eski chat/urls.py

urlpatterns = [
    path('', rooms, name='rooms'),
    path('chat_js/', chat_js, name='chat_js'),
    path('userview/', UserGenericAPIView.as_view(), name='userview'),
    # path('friends_blockeds/', view.friends_blockeds, name='friends_blockeds'),
]