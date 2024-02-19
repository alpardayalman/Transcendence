# eski chat/api/view.py
from Chat.serializers import FriendBlockedSerializer
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.template import loader
from Chat.models import Room, Message, CustomUser
from django.shortcuts import render


@login_required
def friends_blockeds(request):
    if request.method == 'GET':
        user = CustomUser.objects.get(username=request.user.username)
        serializer = FriendBlockedSerializer(user, many=False)
        return JsonResponse({'data': serializer.data}, safe=False)
    

# eski chat/views.py

# Create your views here.
@login_required
def rooms(request):
    user = CustomUser.objects.get(username=request.user.username)
    friends = CustomUser.objects.get(username=request.user.username).friends.all()
    messages = Message.objects.filter(user=user)
    friendMessage = Message.objects.filter(friend=user)
    combined = messages | friendMessage
    combined.order_by('date_added')
    return render(request, 'Chat/rooms.html', {
        'friends': friends,
        'messages': messages,
        'combined': combined
        })


@login_required
def chat_js(request):
    template = loader.get_template("Chat/js/chat.js")
    return HttpResponse(template.render())