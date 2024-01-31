from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .serializers import UserSerializer
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
    return render(request, 'room/rooms.html', {
        'friends': friends,
        'messages': messages,
        'combined': combined})

@login_required
def room(request, slug):
    return render(request, 'room/room.html', {})

@login_required
def friends_blockeds(request):
    if request.method == 'GET':
        user = CustomUser.objects.get(username=request.user.username)
        serializer = UserSerializer(user)
        return JsonResponse({'data': serializer.data}, safe=False)
