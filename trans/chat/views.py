from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .api.serializers import UserSerializer
from django.contrib.auth.decorators import login_required
from .models import Room, Message, CustomUser
from django.template import loader

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
        'combined': combined
        })

@login_required
def chat_js(request):
    template = loader.get_template("room/chat.js")
    return HttpResponse(template.render())
