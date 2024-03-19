from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND

from Chat.models import CustomUser

class DeleteObjectView(APIView):

    def delete(self, request, username):
        try:
            object_to_delete = CustomUser.objects.get(username=username)
            object_to_delete.delete()
            return Response({'status':204})
        except CustomUser.DoesNotExist:
            return Response({'status':404})