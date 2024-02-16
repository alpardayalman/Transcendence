from django.shortcuts import render, redirect
from django.views import View
import pyotp
from django.http import JsonResponse
import qrcode
import base64
from io import BytesIO
from django.contrib.auth.decorators import login_required
import hashlib
from chat.models import CustomUser
from django.contrib.auth import authenticate, login
import jwt
from datetime import datetime, timedelta
from django.http import HttpResponseRedirect
import urllib.parse
import urllib.request
import json
import requests
from django.conf import settings
from ..forms import CreateUserForm
from .models import AuthInfo

@login_required
def enable_2fa(request):
    user1 = CustomUser.objects.filter(username=request.user.username).get()
    if(AuthInfo.objects.filter(user=user1).exists() and user1.is_2fa_enabled == True):
        return JsonResponse({'otp_secret': "exists", 'qr_image': "exists"})
    else:
        AuthInfo.objects.create(secret_key = pyotp.random_base32(), user=user1)
        auth_info_details = AuthInfo.objects.get(user=user1)
        new_secret_key = pyotp.random_base32()
        auth_info_details.secret_key = new_secret_key
        user1.is_2fa_enabled = True
        auth_info_details.save()
        user1.save()
        print("not exists ", auth_info_details.secret_key)
        totp = pyotp.TOTP(new_secret_key)
        otp_uri = totp.provisioning_uri(user1.username, issuer_name="nigerian iterator gangsta group of asocials")
        qr_img = qrcode.make(otp_uri)
        buffered = BytesIO()
        qr_img.save(buffered, format="PNG")
        qr_base64_str = base64.b64encode(buffered.getvalue()).decode()
        return JsonResponse({'otp_secret': new_secret_key, 'qr_image': qr_base64_str})

@login_required
def two_fa(request):
    user = CustomUser.objects.get(username=request.user.username)
    is_2fa_enabled = user.is_2fa_enabled
    print("SAP viewspy 55.satir ", is_2fa_enabled)
    return render(request, 'SPA/two_fa.html', {'is_2fa_enabled': is_2fa_enabled})


@login_required(login_url='login')
def disable_2fa(request):
    print("disable 2fa")
    user1 = CustomUser.objects.filter(username=request.user.username).get()
    try:
        auth_info = AuthInfo.objects.get(user=user1)
    except AuthInfo.DoesNotExist:
        print("AuthInfo.DoesNotExist")
        return render(request, 'SPA/spa_page.html')
    print("auth_info: ", auth_info.secret_key)
    # AuthInfo kaydının 2FA durumunu devre dışı bırak
    user1.is_2fa_enabled = False
    user1.save()
    auth_info.delete()

    return render(request, 'SPA/spa_page.html')

def verify_2fa(request):
    print("verify 2fa\n\n\n\n\n")
    if request.method == 'POST':
        verification_code = request.POST.get('verification_code')
        user1 = CustomUser.objects.filter(username=request.session['username']).get()
        auth_info_details = AuthInfo.objects.get(user=user1)
        secret_key = auth_info_details.secret_key
        totp = pyotp.TOTP(secret_key)
        if totp.verify(verification_code):
            print("verified user pass", request.session['password'])
            user = authenticate(request, username=user1.username, password=request.session['password'])
            print("user: ", user)
            if (user is not None):
                login(request, user)
                print("yarrak\n\n\n\n\n\n\n\n")
                return redirect('spa_main')
        else:
            print("Invalid verification code pls try again")
            return render(request, 'SPA/verify_2fa.html', {'error': True, 'msg': 'Invalid verification code pls try again'})
    else:
        print("get request")
        return render(request, 'SPA/verify_2fa.html')


#--------------------------------------42 Auth--------------------------------------------#

def loginWithFourtyTwoAuth(request):
    print(request.method)
    if request.method == 'GET':
        UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
        AUTHORIZATION_URL = "https://api.intra.42.fr/oauth/authorize"

        authorization_params = {
            "client_id": UID,
            "redirect_uri": "http://127.0.0.1:8000/redirect_auth/",
            "response_type": "code",
            "scope": "public",
        }
        authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"
        print("authorization_url: \n")
        print(authorization_url)
        # return redirect(authorization_url)
        return redirect(authorization_url)
    else:
        return HttpResponse("You are not allowed here")


def ft_auth(user_data, request):
    if check_jwt(request):
        # jwt cookielerde saklamak lazim.
        print("jwt var")
        jwt_token = request.COOKIES.get('jwt')
        print("jwt_token: ", jwt_token)
        payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms='HS256')
        user = authenticate(request, username=payload['username'], password=jwt_token)
        if user is not None:
            login(request, user)
            return redirect('spa_main')
    else:    
        print(settings.SECRET_KEY)
        user = None
    try:
        user = CustomUser.objects.get(username=user_data.get('login'))
        print("user: ", user)
    except CustomUser.DoesNotExist:
        username = user_data.get('login')
        request.session['key'] = _jwt_init(username)
        print('request.session["key"]:', request.session['key'])
        form_data = {
        'username': user_data.get('login'),
        'email': user_data.get('email'),
        'password1': request.session['key'],
        'password2': request.session['key'],
        }
        form = CreateUserForm(data=form_data)
        if form.is_valid():
            form.save()
            print("Tüm cookieler response:", cookies)
        else:
            print(form.errors)

    token = _jwt_init(user_data.get('login'))


    response = render(request, 'SPA/spa_main.html')
    cookies = request.COOKIES
    response.set_cookie('jwt', token, max_age=3600)

    user = CustomUser.objects.get(username=user_data.get('login'))
    user.set_password(token)
    user.jwt_secret = token
    user.save()

    print("token: ", token)
    user = authenticate(request, username=user_data.get('login'), password=token) #kontrol edilcek
    print("user: ", user)
    if user is not None:
        print("user:asdasd ", user)
        login(request, user)
        return response

    return redirect('spa_main')



def redirect_auth(request):
    if(request.method == 'GET'):
        code = request.GET.get('code', None)
        token_params = {
        "client_id": "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614",
        "client_secret": "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",
        "code": code,
        "grant_type": "authorization_code", #kontrol edilcek
        "redirect_uri": "http://127.0.0.1:8000/redirect_auth/", #kontrol edilcek
    }
    data = urllib.parse.urlencode(token_params).encode('utf-8')
    req = urllib.request.Request("https://api.intra.42.fr/oauth/token", data=data)
    response = urllib.request.urlopen(req)
    if response.status == 200:
        token_data = json.loads(response.read().decode('utf-8'))
        access_token = token_data.get('access_token')
        profile_url = "https://api.intra.42.fr/v2/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        profile_response = requests.get(profile_url, headers=headers)

        if profile_response.status_code == 200:
            user_data = profile_response.json()
            ft_auth(user_data, request)
            return redirect('spa_main')
        else:
            return {"error": "Unable to fetch user profile"}
    return HttpResponse("You are not allowed here2")

from jwt.algorithms import get_default_algorithms

def _jwt_init(username):
        
	payload = {
	'username': username,
	'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24 * 7),
	}
	token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
	return token


def check_jwt(request):
    user_data = request.session.get('username')
    print(f"user_data {user_data}")
    # user = CustomUser.objects.get(username=user_data.get('login'))
    cookies = request.COOKIES

    print("Tüm cookieler:", cookies)
    token = request.COOKIES.get('jwt')
    if not token:
        return False
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        print("payload12312312321 ",payload)
    except jwt.ExpiredSignatureError:
        return False
    except jwt.DecodeError:
        return False

    print("payload: ")
    return True
