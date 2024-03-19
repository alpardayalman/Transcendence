from django.conf import settings
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from Display.forms import CreateUserForm
from Api.serializers import UserLoginSerializer, UserRegisterSerializer


class UserLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            if user.is_2fa_enabled:
                return Response({'username': user.username,'twofa': True, "detail": "Two Fa", "status":400})
            user.online_status = True
            user.save()
            login(request, user) 
            return Response({'access_token': user.get_token(), "detail": "User logged in successfully.", "status":status.HTTP_200_OK})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegisterAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserRegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data
                form = CreateUserForm(user)
                form.save()
                return Response({"message":"User Registration successful", "status":201})
            else:
                return Response({"message":serializer.errors, "status":400})
        except:
            return Response({"message":serializer.errors, "status":400})


class CheckLoginStatus(APIView):
    def get(self, request):
        try:
            access_token = request.COOKIES.get('access_token')
            if not access_token:
                return Response({'isLoggedIn': False, 'message': 'User is not authenticated'}, status=200)
            token = AccessToken(access_token)
            return Response({'isLoggedIn': True, 'username': request.user.username}, status=200)
        except:
            return Response({'isLoggedIn': False, 'message': 'User is not authenticated'}, status=200)
