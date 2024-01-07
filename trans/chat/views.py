from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Room, Message, CustomUser

# Create your views here.
@login_required
def rooms(request):
    rooms = Room.objects.all()
    user = CustomUser.objects.get(username=request.user.username)
    friends = CustomUser.objects.get(username=request.user.username).friends.all()
    messages = Message.objects.filter(user=user)
    return render(request, 'room/rooms.html', {'rooms': rooms, 'friends': friends, 'messages': messages})

@login_required
def room(request, slug):
    room = Room.objects.get(slug=slug)
    messages = Message.objects.filter(room=room)[0:25]
    return render(request, 'room/room.html', {'room': room, 'messages': messages})

@login_required
def message(request):
    user = CustomUser.objects.get(username=request.user.username)
    messages = Message.objects.filter(user=user)
    data = serializers.serialize('json', messages)
    return JsonResponse(data, safe=False)
