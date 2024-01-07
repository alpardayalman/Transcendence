from django.urls import path
from . import views

urlpatterns = [
    path('', views.rooms, name='rooms'),
    path('<slug:slug>/', views.room, name='room'),
    path('message', views.message, name='message')
    # path('<str:room_name>/', views.room, name='room'),
]