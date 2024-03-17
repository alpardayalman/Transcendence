from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializer import UserBlockSerializer
from django.http import JsonResponse
from Chat.models import BlockedUser, CustomUser
from rest_framework.permissions import IsAuthenticated

class UserBlockAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            serializer = UserBlockSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'succes':'succes'}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse(serializer.errors, status=400)
        # if serializer.errors:
        # block_user = BlockedUser.objects.filter(user=CustomUser.objects.get(username=request.data['username']), blocked=CustomUser.objects.get(username=request.data['block']))
        # print(block_user)
        # CustomUser.objects.get(username=request.data['username']).blockeds.add(block_user[0])
        # return JsonResponse(serializer.errors, status=400)