from django.urls import path

from chat import consumers as chat_consumers
from S_A_P import consumers as sap_consumers

websocket_urlpatterns = [
    path('chat/', chat_consumers.ChatConsumer.as_asgi()),
    path('game/', sap_consumers.GameConsumer.as_asgi()),
]