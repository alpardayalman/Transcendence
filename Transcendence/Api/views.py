from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
import random
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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Api.serializers import UserLoginSerializer, UserRegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from django.contrib.sessions.models import Session
import ssl
import sys


@api_view(['GET'])
def playerCheck(request):
	number = random.randint(0, 100)
	rtn = False
	if number < 20:
		rtn = True
	return Response({"status": rtn})

# -------------------------------------------------------------------------
#eski 2fa views



class enable_2fa(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user1 = CustomUser.objects.filter(username=request.user.username).get()
        if(AuthInfo.objects.filter(user=user1).exists() and user1.is_2fa_enabled == True):
            return Response({'otp_secret': "exists", 'qr_image': "exists"}) # degistirilebilir
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
            return Response({'otp_secret': new_secret_key, 'qr_image': qr_base64_str})


class two_fa(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        user = CustomUser.objects.get(username=request.user.username)
        is_2fa_enabled = user.is_2fa_enabled
        return Response({'is_2fa_enabled': is_2fa_enabled})
    # user = CustomUser.objects.get(username=request.user.username)
    # is_2fa_enabled = user.is_2fa_enabled
    # return render(request, 'Display/two_fa.html', {'is_2fa_enabled': is_2fa_enabled})


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
            print("\n\n\na\n\n\n",request.data)
            verification_code = request.data.get('verification_code')
            print("\nverification_code= ", verification_code)
            user1 = CustomUser.objects.get(username=request.data.get('username'))
            print("\n\n\na\n\n\n",user1)
            auth_info_details = AuthInfo.objects.get(user=user1)
            secret_key = auth_info_details.secret_key
            totp = pyotp.TOTP(secret_key)
            if totp.verify(verification_code):
                print("\nverification_code= ", verification_code)
                # user = authenticate(request, username=user1.username, password=user1.password)
                if (user1 is not None):
                    print("\nuser1 is not none", user1.username)
                    login(request, user1)
                    return Response({'access_token': user1.get_token(), "detail": "User logged in successfully.", "status":200})
            else:
                return Response({'error': 'Invalid verification code', "status":402})
        except:
            return Response({'error': 'server problem', "status":500})


# #--------------------------------------API--------------------------------------------#


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


class CheckLoginStatus(APIView):

    def get(self, request):
        # print("request cookies", request.COOKIES)
        try:
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
            "redirect_uri": "http://127.0.0.1:8000/ft_login/",
            "response_type": "code",
            "scope": "public",
        }
        authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"

        # Add JavaScript code to open a new tab
        print("authorization_url= ", authorization_url)

        return JsonResponse({'code':authorization_url}, status=status.HTTP_200_OK)

#thats not a cookie access token
def ft_auth(user_data, request, access_token):
    form_data = {}
    try:
        user = CustomUser.objects.get(username=user_data.get('login'))

        if user.is_2fa_enabled:
            return user
        user.set_password(access_token)
        test = {
            'username': user.username,
            'password': access_token,
        }
        serializer = UserLoginSerializer(data=test)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return user
    except CustomUser.DoesNotExist:
        username = user_data.get('login')
        form_data = {
            'username': username,
            'email': user_data.get('email'),
            'first_name': user_data.get('first_name'),
            'last_name': user_data.get('last_name'),
            'password1': access_token,
            'password2': access_token,
            #profile pic eklenicek
        }
        form = CreateUserForm(data=form_data)
        if form.is_valid():
            form.save()
        else:
            print(form.errors)
    user = authenticate(request, username=user_data.get('login'), password=access_token)
    if user is not None:
        login(request, user)
        # request.session['access_token'] = user.get_token()
        # print("user.get_token()= ", request.session['access_token'])
        return user
    return None



class CallbackView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('url')
        lasque = code.split("=")[1]
        print("dev py: code= ",lasque)
        print("dev py: request.data= ", request.data)
        token_params = {
            "client_id": "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614",
            "client_secret": "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",
            "code": lasque,
            "grant_type": "authorization_code",
            "redirect_uri": "http://127.0.0.1:8000/ft_login/",
        }
        data = urllib.parse.urlencode(token_params).encode('utf-8')
        print("data= ", data)
        req = urllib.request.Request("https://api.intra.42.fr/oauth/token", data=data)
        try:
            with urllib.request.urlopen(req, context=ssl._create_unverified_context()) as response:
                if response.status == 200:
                    token_data = json.loads(response.read().decode('utf-8'))
                    print("token_data= ", token_data)
                    access_token = token_data.get('access_token')
                    profile_url = "https://api.intra.42.fr/v2/me"
                    headers = {"Authorization": f"Bearer {access_token}"}
                    profile_response = requests.get(profile_url, headers=headers)
                    print("profile_response= ", profile_response)
                    if profile_response.status_code == 200:
                        user_data = profile_response.json()
                        user = ft_auth(user_data, request, access_token)
                        if user is not None:
                            if user.is_2fa_enabled:
                                print("\n\n username", user.username)
                                print("ANTEBIN HAMAMLAR\n\n\n\n")
                                return Response({'username': user.username,'twofa': True, "detail": "Two Fa", "status":400})
                            else:
                                return Response({'access_token': user.get_token(), "detail": "User logged in successfully.", "status":status.HTTP_200_OK})
                        else:
                            print("user is none")
                            return Response({'error': 'Unable to fetch user profile'}, status=501)
                    else:
                        return Response({'error': 'Unable to fetch user profile'}, status=504)
                else:
                    return Response({'error': 'Unable to obtain access token'}, status=502)
        except urllib.error.HTTPError as e:
            return Response({'error': f'HTTPError: {e.code} - {e.reason}'}, status=503)

