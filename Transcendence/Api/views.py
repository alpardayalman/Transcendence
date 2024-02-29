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


def _jwt_init(username):
        
	payload = {
	'username': username,
	'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24 * 7),
	}
	token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
	return token


def check_jwt(request):
    user_data = request.session.get('username')
    cookies = request.COOKIES
    token = request.COOKIES.get('jwt')

    if not token:
        return False
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
    except jwt.ExpiredSignatureError:
        return False
    except jwt.DecodeError:
        return False
    return True


# #--------------------------------------API--------------------------------------------#

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Api.serializers import UserLoginSerializer, UserRegisterSerializer


class UserLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        print("request.data= ", request.data)
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            # Login the user and create session

            login(request, user)  # Login user baya sus su an.
            request.session.set_expiry(0)  # Set session expiry (optional)
            request.session.save()  # Save session
            return Response({"detail": "User logged in successfully.", "status":status.HTTP_200_OK})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserRegisterAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserRegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data
                # Login the user and create session
                form = CreateUserForm(user)
                form.save()
                profile_photo = request.data.get('profile_photo')
                if profile_photo:
                    user.profile_photo = profile_photo
                user.save()
                return Response({"detail": "User created successfully.", "status":status.HTTP_200_OK})
            else:
                print('olmuyor')
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            print('direk girmiyor')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckLoginStatus(APIView):
    def get(self, request):
        print("HELLO")
        if request.user.is_authenticated:
            print("true")
            return Response({'isLoggedIn': True, 'username': request.user.username}, status=200)
        else:
            print("false")
            return Response({'isLoggedIn': False, 'message': 'User is not authenticated'}, status=200)


class LoginWithFourtyTwoAuth(APIView):
    def get(self, request):
        UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
        AUTHORIZATION_URL = "https://api.intra.42.fr/oauth/authorize"

        authorization_params = {
            "client_id": UID,
            "redirect_uri": "http://127.0.0.1:8000/redirect_auth/",
            "response_type": "code",
            "scope": "public",
        }
        authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"

        # Add JavaScript code to open a new tab

        return JsonResponse({'code':authorization_url}, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view

def ft_auth(user_data, request):
    if check_jwt(request):
        jwt_token = request.COOKIES.get('jwt')
        payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms='HS256')
        user = authenticate(request, username=payload['username'], password=jwt_token)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'User authenticated successfully'})
    else:
        user = None

    try:
        user = CustomUser.objects.get(username=user_data.get('login'))
    except CustomUser.DoesNotExist:
        username = user_data.get('login')
        request.session['key'] = _jwt_init(username)
        form_data = {
            'username': user_data.get('login'),
            'email': user_data.get('email'),
            'password1': request.session['key'],
            'password2': request.session['key'],
        }
        form = CreateUserForm(data=form_data)
        if form.is_valid():
            form.save()
        else:
            print(form.errors)

    token = _jwt_init(user_data.get('login'))

    response = JsonResponse({'message': 'User authenticated successfully'})
    cookies = request.COOKIES
    response.set_cookie('jwt', token, max_age=3600)

    user = CustomUser.objects.get(username=user_data.get('login'))
    user.set_password(token)
    user.jwt_secret = token
    user.save()

    user = authenticate(request, username=user_data.get('login'), password=token)
    if user is not None:
        login(request, user)
        return response

    return JsonResponse({'error': 'Authentication failed'}, status=401)

def CallbackView(request):
    if request.method == 'GET':
        code = request.GET.get('code', None)
        token_params = {
            "client_id": "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614",
            "client_secret": "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",
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://127.0.0.1:8000/redirect_auth/",
        }
        data = urllib.parse.urlencode(token_params).encode('utf-8')
        req = urllib.request.Request("https://api.intra.42.fr/oauth/token", data=data)

        try:
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    token_data = json.loads(response.read().decode('utf-8'))
                    access_token = token_data.get('access_token')
                    profile_url = "https://api.intra.42.fr/v2/me"
                    headers = {"Authorization": f"Bearer {access_token}"}
                    profile_response = requests.get(profile_url, headers=headers)

                    if profile_response.status_code == 200:
                        user_data = profile_response.json()
                        # Replace ft_auth with the actual implementation
                        ft_auth(user_data, request=request)
                        return redirect('login')
                    else:
                        return HttpResponse({'error': 'Unable to fetch user profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return HttpResponse({'error': 'Unable to obtain access token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except urllib.error.HTTPError as e:
            return HttpResponse({'error': f'HTTPError: {e.code} - {e.reason}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#settings serializer.py
class ChangePassAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.validated_data)
        return Response({'status': 'OK'})

