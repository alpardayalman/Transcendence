from django.urls import path

from Chat import consumers as chat_consumers

websocket_urlpatterns = [
    path('', chat_consumers.ChatConsumer.as_asgi()),
]