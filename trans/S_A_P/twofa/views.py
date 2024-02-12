from django.shortcuts import render, redirect
from django.views import View
from .models import AuthInfo
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

class AuthCheckView(View):
    def get(self, request, pin):
        user1 = CustomUser.objects.filter(username=request.user.username).get()
        auth_info_details = AuthInfo.objects.get(user=user1)
        secret_key = auth_info_details.secret_key
        totp = pyotp.TOTP(secret_key)
        status = totp.verify(pin)
        return JsonResponse({"status": True if status else False, "data": secret_key})
    
# def update_code(user, secret_key):
#     user.is_2fa_enabled = True
#     secret_key = hashlib.md5(secret_key.encode()).hexdigest()
#     user.save()
#     print("update ",user, user.is_2fa_enabled)
#     AuthInfo.objects.filter(user=user).update(secret_key=secret_key)

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

    # İstenilen sayfaya yönlendir
    return render(request, 'SPA/spa_page.html')

def verify_2fa(request):
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
                return render(request, 'SPA/spa_page.html')
        else:
            return render(request, 'SPA/verify_2fa.html', {'error': True, 'msg': 'Invalid verification code pls try again'})
    else:
        return render(request, 'SPA/verify_2fa.html')

def login_with_42(request):
    print(request.method)
    if request.method == 'GET':
        UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
        SECRET = "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"
        AUTHORIZATION_URL = "https://api.intra.42.fr/oauth/authorize"

        authorization_params = {
            "client_id": UID,
            "redirect_uri": "http://127.0.0.1:8000/",
            "response_type": "code",
            "scope": "public",
        }
        authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"
        print("authorization_url: \n")
        print(authorization_url)
        return redirect(authorization_url)
    else:
        return HttpResponse("You are not allowed here")


def get_42_token(request):
    UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
    SECRET = "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"
    token_url = "https://api.intra.42.fr/oauth/token"
    urll = request.GET.get('code', None)
    print("urll: \n")
    print(urll)
    token_params = {
        "client_id": UID,
        "client_secret": SECRET,
        "code": urll,
        # "grant_type": "client_credentials",
        "grant_type": "authorization_code", #kontrol edilcek
        "redirect_uri": "http://10.12.11.4:8000/login", #kontrol edilcek
    }
    response = requests.post(token_url, data=token_params)

    if response.status_code == 200:
        access_token = response.json().get("access_token")

        profile_url = "https://api.intra.42.fr/v2/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        profile_response = requests.get(profile_url, headers=headers)

        if profile_response.status_code == 200:
            user_data = profile_response.json()
            return user_data
        else:
            return {"error": "Unable to fetch user profile"}

    else:
        return {"error": "Unable to obtain access token"}


# def 

# jwt ekleme
def loginWithFourtyTwoAuth(request):
    user_data = get_42_token(request)
    if User.objects.get(username=user_data.get('login')):
        user = User.objects.get(username=user_data.get('login'))
        login(request, user)
        return redirect('spa_main')
    else:
        form = CustomUserForm()
        form_data = {
        'username': user_data.get('login'),
        'email': user_data.get('email'),
        'password1': "123.Emir123",
        'password2': "123.Emir123",
        }
        form = CreateUserForm(data=form_data)
        if form.is_valid():
            user = form.save()
        else:
            print(form.errors)
        user = authenticate(request, username=user_data.get('login'), password="123.Emir123")
        if user is not None:
            login(request, user)
            return redirect('spa_main')
        else:
            messages.info(request, 'Username Or Password is incorect')
            context = {}

