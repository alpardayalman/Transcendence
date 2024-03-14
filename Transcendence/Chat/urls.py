from django.urls import path
# from hat.api import view
from Chat.serializers import UserGenericAPIView

#eski chat/urls.py

urlpatterns = [
    path('userview/', UserGenericAPIView.as_view(), name='userview'),
    # path('friends_blockeds/', view.friends_blockeds, name='friends_blockeds'),
]