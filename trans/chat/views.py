from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Room, Message, CustomUser

# Create your views here.
@login_required
def rooms(request):
    rooms = Room.objects.all()
    friends = CustomUser.objects.get(username=request.user.username).friends.all()
    return render(request, 'room/rooms.html', {'rooms': rooms, 'friends': friends})

@login_required
def room(request, slug):
    room = Room.objects.get(slug=slug)
    messages = Message.objects.filter(room=room)[0:25]
    return render(request, 'room/room.html', {'room': room, 'messages': messages})
