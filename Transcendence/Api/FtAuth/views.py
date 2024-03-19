from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from Chat.models import CustomUser
import urllib.parse
import json
import requests
from Display.forms import CreateUserForm
from Api.serializers import UserLoginSerializer
import ssl
import urllib.request
from Display.forms import ProfilePictureForm
import os

class LoginWithFourtyTwoAuth(APIView):
    def get(self, request):
        UID = os.environ.get("CLIENT_ID")
        AUTHORIZATION_URL = os.environ.get("AUTHORIZATION_URL")

        authorization_params = {
            "client_id": UID,
            "redirect_uri": os.environ.get("REDIRECT_URI"),
            "response_type": "code",
            "scope": "public",
        }
        authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"
        return JsonResponse({'code':authorization_url}, status=status.HTTP_200_OK)


def download_image(url, filename):
    with urllib.request.urlopen(url) as response:
        with open(filename, 'wb') as f:
            f.write(response.read())

def ft_auth(user_data, request, access_token):
    username = ''
    form_data = {}
    i = 0
    try:
        user = CustomUser.objects.get(username=user_data.get('login'))

        if user.is_42_student is not True:
            i = 1
            while i:
                user = CustomUser.objects.get(username=user_data.get('login')+str(i))
                i += 1
                if (user.is_42_student == True):
                    break

        if user.is_2fa_enabled:
            return user
        if user.is_42_student:
            test = {
                'username': user.username,
                'password': access_token,
            }
            serializer = UserLoginSerializer(data=test)
            if serializer.is_valid():
                user = serializer.validated_data
                user.online_status = True
                user.save()
                login(request, user)
                return user
    except CustomUser.DoesNotExist:
        username = user_data.get('login')
        if i:
            username = user_data.get('login')+str(i)
        form_data = {
            'username': username,
            'email': user_data.get('email'),
            'first_name': user_data.get('first_name'),
            'last_name': user_data.get('last_name'),
            'password1': access_token,
            'password2': access_token,
            'is_42_student': True,
        }
        form = CreateUserForm(data=form_data)
        if form.is_valid():
            form.save()
        else:
            print(form.errors)
    user = authenticate(request, username=username, password=access_token)
    if user is not None:
        user.online_status = True

        form2 = ProfilePictureForm(request.POST, request.FILES, instance=user)
        if form2.is_valid():
            filename = f'media/profile_pictures/{user.username}.jpg'
            download_image(user_data.get('image').get('link'), filename)
            filename = f'profile_pictures/{user.username}.jpg'
            form2.instance.profile_picture = filename
            form2.save()
        
        user.save()
        login(request, user)
        return user
    return None



class CallbackView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('url').split("=")[1]
        token_params = {
            "client_id": os.environ.get("CLIENT_ID"),
            "client_secret": os.environ.get("CLIENT_SECRET"),
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": os.environ.get("REDIRECT_URI"),
        }
        data = urllib.parse.urlencode(token_params).encode('utf-8')
        req = urllib.request.Request("https://api.intra.42.fr/oauth/token", data=data)
        try:
            with urllib.request.urlopen(req, context=ssl._create_unverified_context()) as response:
                if response.status == 200:
                    token_data = json.loads(response.read().decode('utf-8'))
                    access_token = token_data.get('access_token')
                    profile_url = "https://api.intra.42.fr/v2/me"
                    headers = {"Authorization": f"Bearer {access_token}"}
                    profile_response = requests.get(profile_url, headers=headers)
                    if profile_response.status_code == 200:
                        user_data = profile_response.json()
                        user = ft_auth(user_data, request, access_token)
                        if user is not None:
                            if user.is_2fa_enabled:
                                return Response({'username': user.username,'twofa': True, "detail": "Two Fa", "status":400})
                            else:
                                return Response({'access_token': user.get_token(), "detail": "User logged in successfully.", "status":status.HTTP_200_OK})
                        else:
                            return Response({'error': 'Unable to fetch user profile'}, status=501)
                    else:
                        return Response({'error': 'Unable to fetch user profile'}, status=504)
                else:
                    return Response({'error': 'Unable to obtain access token'}, status=502)
        except urllib.error.HTTPError as e:
            return Response({'error': f'HTTPError: {e.code} - {e.reason}'}, status=503)

