from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Room, Message, CustomUser

# Create your views here.
@login_required
def rooms(request):
    user = CustomUser.objects.get(username=request.user.username)
    friends = CustomUser.objects.get(username=request.user.username).friends.all()
    messages = Message.objects.filter(user=user)
    friendMessage = Message.objects.filter(friend=user)
    combined = messages | friendMessage
    combined.order_by('date_added')
    return render(request, 'room/rooms.html', {'friends': friends, 'messages': messages, 'combined': combined})

@login_required
def room(request, slug):
    return render(request, 'room/room.html', {})

@login_required
def message(request):
    user = CustomUser.objects.get(username=request.user.username)
    messages = Message.objects.filter(user=user)
    data = serializers.serialize('json', messages)
    return JsonResponse(data, safe=False)
