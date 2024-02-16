from .serializers import FriendBlockedSerializer
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from ..models import CustomUser

@login_required
def friends_blockeds(request):
    if request.method == 'GET':
        user = CustomUser.objects.get(username=request.user.username)
        serializer = FriendBlockedSerializer(user, many=False)
        return JsonResponse({'data': serializer.data}, safe=False)