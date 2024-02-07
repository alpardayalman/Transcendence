from django.urls import path
from chat.api import view
from . import views
from .api.serializers import UserGenericAPIView

urlpatterns = [
    path('', views.rooms, name='rooms'),
    path('chat_js/', views.chat_js, name='chat_js'),
    path('friends_blockeds/', view.friends_blockeds, name='friends_blockeds'),

    path('userview/', UserGenericAPIView.as_view(), name='userview'),

    # path('<slug:slug>/', views.room, name='room'),
    # path('<str:room_name>/', views.room, name='room'),
]