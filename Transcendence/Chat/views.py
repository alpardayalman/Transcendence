from Chat.serializers import FriendBlockedSerializer
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.template import loader
from Chat.models import Message, CustomUser, BlockedUser


@login_required
def friends_blockeds(request):
    if request.method == 'GET':
        user = CustomUser.objects.get(username=request.user.username)
        serializer = FriendBlockedSerializer(user, many=False)
        return JsonResponse({'data': serializer.data}, safe=False)


@login_required(login_url='login')
def chatPage(request, filename):
    user = CustomUser.objects.get(username=request.user.username)
    friends = CustomUser.objects.get(username=request.user.username).friends.all()
    messages = Message.objects.filter(user=user)
    friendMessage = Message.objects.filter(friend=user)
    combined = messages | friendMessage
    combined.order_by('date_added')
    blockeds = BlockedUser.objects.filter(user=user)
    allUser = CustomUser.objects.all()
    temp = loader.get_template('Chat/chat.html')
    context = {
        'friends': friends,
        'messages': messages,
        'combined': combined,
        'blockeds': blockeds,
        'users': allUser,
        'user': user,
    }
    if filename == 'chat.html':
        return HttpResponse(temp.render(context))
    return HttpResponse("File not found")

