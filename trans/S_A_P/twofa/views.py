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