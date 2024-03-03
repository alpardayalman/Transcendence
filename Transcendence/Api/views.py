from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.


from rest_framework.views import APIView
from rest_framework.decorators import api_view
import random

@api_view(['GET'])
def playerCheck(request):
	number = random.randint(0, 100)
	rtn = False
	if number < 20:
		rtn = True
	return Response({"status": rtn})

    












# -------------------------------------------------------------------------

#eski 2fa views

from django.shortcuts import render, redirect
from django.views import View
import pyotp
from django.http import JsonResponse
import qrcode
import base64
from io import BytesIO
from django.contrib.auth.decorators import login_required
import hashlib
from Chat.models import CustomUser
from django.contrib.auth import authenticate, login
import jwt
from datetime import datetime, timedelta
from django.http import HttpResponse
import urllib.parse
import urllib.request
import json
import requests
from django.conf import settings
from Display.forms import CreateUserForm
from Api.models import AuthInfo

@login_required
def enable_2fa(request):
    user1 = CustomUser.objects.filter(username=request.user.username).get()
    if(AuthInfo.objects.filter(user=user1).exists() and user1.is_2fa_enabled == True):
        return JsonResponse({'otp_secret': "exists", 'qr_image': "exists"}) # degistirilebilir
    else:
        new_secret_key = pyotp.random_base32()
        AuthInfo.objects.create(secret_key = new_secret_key, user=user1)
        auth_info_details = AuthInfo.objects.get(user=user1)
        # auth_info_details.secret_key = new_secret_key
        user1.is_2fa_enabled = True
        auth_info_details.save()
        user1.save()
        totp = pyotp.TOTP(new_secret_key)
        otp_uri = totp.provisioning_uri(user1.username, issuer_name="nigerian iterator gangsta group of asocials")
        qr_img = qrcode.make(otp_uri)
        buffered = BytesIO()
        qr_img.save(buffered)
        qr_base64_str = base64.b64encode(buffered.getvalue()).decode()
        return JsonResponse({'otp_secret': new_secret_key, 'qr_image': qr_base64_str})

@login_required
def two_fa(request):
    user = CustomUser.objects.get(username=request.user.username)
    is_2fa_enabled = user.is_2fa_enabled
    return render(request, 'Display/two_fa.html', {'is_2fa_enabled': is_2fa_enabled})


@login_required(login_url='login')
def disable_2fa(request):
    user1 = CustomUser.objects.filter(username=request.user.username).get()
    try:
        auth_info = AuthInfo.objects.get(user=user1)
    except AuthInfo.DoesNotExist:
        return render(request, 'Display/spa_page.html')
    user1.is_2fa_enabled = False
    user1.save()
    auth_info.delete()

    return render(request, 'Display/spa_page.html')

def verify_2fa(request):
    if request.method == 'POST':
        verification_code = request.POST.get('verification_code')
        user1 = CustomUser.objects.filter(username=request.session['username']).get()
        auth_info_details = AuthInfo.objects.get(user=user1)
        secret_key = auth_info_details.secret_key
        totp = pyotp.TOTP(secret_key)
        if totp.verify(verification_code):
            user = authenticate(request, username=user1.username, password=request.session['password'])
            if (user is not None):
                login(request, user)
                return redirect('spa_main')
        else:
            return render(request, 'Display/verify_2fa.html', {'error': True, 'msg': 'Invalid verification code pls try again'})
    else:
        return render(request, 'Display/verify_2fa.html')


#-------------------------------------- JWT --------------------------------------------#


# #--------------------------------------API--------------------------------------------#

# views.py
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Api.serializers import UserLoginSerializer, UserRegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class UserLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        print("request.data= ", request.data)
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            # post request
            print("serializer.validated_data= ", serializer.validated_data)
            user = serializer.validated_data
            # Login the user and create session

            
            login(request, user)  # Login user baya sus su an.
            request.session.save()  # Save session
            return Response({'access_token': user.get_token(), "detail": "User logged in successfully.", "status":status.HTTP_200_OK})
        else:
            print('olmuyor')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# jwt token cookiede saklanilacak front end kisminda heaader. logout durumunda token blackliste alinacak.
class UserRegisterAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserRegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data
                # Login the user and create session
                form = CreateUserForm(user)
                form.save()
                return Response({"detail": "User created successfully.", "status":status.HTTP_200_OK})
            else:
                print('olmuyor')
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            print('direk girmiyor')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate, login, logout

def login_user42(request):
    code = request.data.get('code')
    print("dev py: code= ",code[7:])
    print("dev py: request.data= ", request.data)
    token_params = {
        "client_id": "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614",
        "client_secret": "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",
        "code": code[7:],
        "grant_type": "authorization_code",
        "redirect_uri": "http://127.0.0.1:8000/login/",
    }
    data = urllib.parse.urlencode(token_params).encode('utf-8')
    print("data= ", data)
    req = urllib.request.Request("https://api.intra.42.fr/oauth/token", data=data)
    #, context=ssl._create_unverified_context()
    try:
        with urllib.request.urlopen(req, context=ssl._create_unverified_context()) as response:
            if response.status == 200:
                token_data = json.loads(response.read().decode('utf-8'))
                print("token_data= ", token_data)
                access_token = token_data.get('access_token')
                profile_url = "https://api.intra.42.fr/v2/me"
                headers = {"Authorization": f"Bearer {access_token}"}
                profile_response = requests.get(profile_url, headers=headers)

                if profile_response.status_code == 200:
                    user_data = profile_response.json()
                    user = ft_auth(user_data, request)
                    user.is_42_student = True
                    print("user.data", user.username)
                    return user
                else:
                    return None
            else:
                return None
    except urllib.error.HTTPError as e:
        return None

class CheckLoginStatus(APIView):
    def get(self, request):
        # full_url = f"http{'s' if request.is_secure() else ''}" + f":{domain}:{port}{path}"
        # print(f"The full URL constructed manually is: {full_url}")
        # print("request cookies", request.COOKIES.get("code42"))
        # print("dev: login status check")
        # print("Path: ", request.build_absolute_uri())
        # print("177 ", request.user)

        try:
            code42 = request.COOKIES.get('code42')
            if code42:
                user = login_user42(request)
                if (user):
                    print("user is registered = ", user)
                    return Response({'isLoggedIn': True, 'username': user.username}, status=200)
                else:
                    return Response({'isLoggedIn': False, 'message': 'User is not authenticated'}, status=200)

            access_token = request.COOKIES.get('access_token')  
            if not access_token:
                return Response({'isLoggedIn': False, 'message': 'User is not authenticated'}, status=200)

            print("access_token= ", access_token)
            print("true")
            token = AccessToken(access_token)
            print("token= ", token)
            return Response({'isLoggedIn': True, 'username': request.user.username}, status=200)
        except:
            print("false")
            return Response({'isLoggedIn': False, 'message': 'User is not authenticated'}, status=200)


class LoginWithFourtyTwoAuth(APIView):
    def get(self, request):
        UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
        AUTHORIZATION_URL = "https://api.intra.42.fr/oauth/authorize"

        authorization_params = {
            "client_id": UID,
            "redirect_uri": "http://127.0.0.1:8000/login/",
            "response_type": "code",
            "scope": "public",
        }
        authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"

        # Add JavaScript code to open a new tab
        print("authorization_url= ", authorization_url)

        return JsonResponse({'code':authorization_url}, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from django.contrib.sessions.models import Session

def ft_auth(user_data, request):
    form_data = {}
    try:
        user = CustomUser.objects.get(username=user_data.get('login'))
        user.set_password("deneysel")
        user = authenticate(request, username=user_data.get('login'), password='deneysel')
        return user
    except CustomUser.DoesNotExist:
        username = user_data.get('login')
        form_data = {
            'username': user_data.get('login'),
            'email': user_data.get('email'),
            'password1': "deneysel",
            'password2': "deneysel",
        }
        form = CreateUserForm(data=form_data)
        if form.is_valid():
            form.save()
        else:
            print(form.errors)
    user = authenticate(request, username=user_data.get('login'), password='deneysel')
    if user is not None:
        login(request, user)
        user.is_42_student = True
        request.session['access_token'] = user.get_token()
        print("user.get_token()= ", request.session['access_token'])
        return user
    return None

import ssl
import sys

class CallbackView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('code')
        print("dev py: code= ",code[7:])
        print("dev py: request.data= ", request.data)
        token_params = {
            "client_id": "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614",
            "client_secret": "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",
            "code": code[7:],
            "grant_type": "authorization_code",
            "redirect_uri": "http://127.0.0.1:8000/login/",
        }
        data = urllib.parse.urlencode(token_params).encode('utf-8')
        print("data= ", data)
        req = urllib.request.Request("https://api.intra.42.fr/oauth/token", data=data)
        #, context=ssl._create_unverified_context()
        try:
            with urllib.request.urlopen(req, context=ssl._create_unverified_context()) as response:
                if response.status == 200:
                    token_data = json.loads(response.read().decode('utf-8'))
                    print("token_data= ", token_data)
                    access_token = token_data.get('access_token')
                    profile_url = "https://api.intra.42.fr/v2/me"
                    headers = {"Authorization": f"Bearer {access_token}"}
                    profile_response = requests.get(profile_url, headers=headers)

                    if profile_response.status_code == 200:
                        user_data = profile_response.json()
                        user = ft_auth(user_data, request)
                        print("user.data", user.username)
                        return Response({'access_token': user.get_token(), "status":status.HTTP_200_OK})
                    else:
                        return Response({'error': 'Unable to fetch user profile'}, status=503)
                else:
                    return Response({'error': 'Unable to obtain access token'}, status=503)
        except urllib.error.HTTPError as e:
            return Response({'error': f'HTTPError: {e.code} - {e.reason}'}, status=503)


class ChangePassAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.validated_data)
        return Response({'status': 'OK'})
