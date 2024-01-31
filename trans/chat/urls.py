from django.urls import path
from . import views

urlpatterns = [
    path('', views.rooms, name='rooms'),
    # path('<slug:slug>/', views.room, name='room'),
    path('friends_blockeds/', views.friends_blockeds, name='friends_blockeds')
    # path('<str:room_name>/', views.room, name='room'),
]