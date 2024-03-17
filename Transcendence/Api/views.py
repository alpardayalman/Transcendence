from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from Chat.models import CustomUser
from io import BytesIO
import pyotp
import qrcode
import base64
import urllib.parse
import urllib.request
import json
import requests
from Display.forms import CreateUserForm
from Api.models import AuthInfo
from Api.serializers import UserLoginSerializer, UserRegisterSerializer
import ssl
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.core.exceptions import ValidationError
import urllib.request
from Display.forms import ProfilePictureForm
import os


# ----------------------------------2FA-------------------------------------#



class enable_2fa(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user1 = CustomUser.objects.filter(username=request.user.username).get()
        if(AuthInfo.objects.filter(user=user1).exists() and user1.is_2fa_enabled == True):
            return Response({'otp_secret': "exists", 'qr_image': "exists"})
        else:
            new_secret_key = pyotp.random_base32()
            AuthInfo.objects.create(secret_key = new_secret_key, user=user1)
            auth_info_details = AuthInfo.objects.get(user=user1)
            user1.is_2fa_enabled = True
            auth_info_details.save()
            user1.save()
            totp = pyotp.TOTP(new_secret_key)
            otp_uri = totp.provisioning_uri(user1.username, issuer_name="nigerian iterator gangsta group of asocials")
            qr_img = qrcode.make(otp_uri)
            buffered = BytesIO()
            qr_img.save(buffered)
            qr_base64_str = base64.b64encode(buffered.getvalue()).decode()
            return Response({'otp_secret': new_secret_key, 'qr_image': qr_base64_str})

class two_fa(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        user = CustomUser.objects.get(username=request.user.username)
        is_2fa_enabled = user.is_2fa_enabled
        return Response({'is_2fa_enabled': is_2fa_enabled})

class disable_2fa(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user1 = CustomUser.objects.filter(username=request.user.username).get()
        try:
            auth_info = AuthInfo.objects.get(user=user1)
        except AuthInfo.DoesNotExist:
            return Response({"status": 400})
        user1.is_2fa_enabled = False
        user1.save()
        auth_info.delete()
        return Response({"status":200})

class verify_2fa(APIView):

    def post(self, request, *args, **kwargs):
        try:
            verification_code = request.data.get('verification_code')
            user1 = CustomUser.objects.get(username=request.data.get('username'))
            auth_info_details = AuthInfo.objects.get(user=user1)
            secret_key = auth_info_details.secret_key
            totp = pyotp.TOTP(secret_key)
            if totp.verify(verification_code):
                if (user1 is not None):
                    user1.online_status = True
                    user1.save()
                    login(request, user1)
                    return Response({'access_token': user1.get_token(), "detail": "User logged in successfully.", "status":200})
            else:
                return Response({'error': 'Invalid verification code', "status":402})
        except:
            return Response({'error': 'server problem', "status":500})


# #--------------------------------------API--------------------------------------------#


class UserLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            if user.is_2fa_enabled:
                return Response({'username': user.username,'twofa': True, "detail": "Two Fa", "status":400})
            user.online_status = True
            user.save()
            login(request, user)  # Login user baya sus su an.
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
    print("\n\n*******user_data: ", user_data.get('image').get('link'))
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
        print("\n\n*******form_data: ", form_data)
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

