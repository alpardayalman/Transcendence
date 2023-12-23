from django.shortcuts import render, redirect
from .forms import YourModelForm
from django.http import JsonResponse
import requests
from django.urls import reverse
#jwttest section line 7-20
import datetime
import jwt

SECRET_KEY = 'alp'  # Uygulama için güvenli bir rastgele anahtar kullanmalısınız.

JWT_ALGORITHM = 'HS256'  # Kullanılan JWT algoritması
JWT_EXPIRATION_DELTA = datetime.timedelta(days=30)

def create_jwt_token(user):
    payload = {
        'user_id': user.get('login'),
        'email':  user.get('email'),
        'exp': datetime.datetime.utcnow() + JWT_EXPIRATION_DELTA,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
#end of jwttest section

#------------------------------------------------------------#

#2fa section line 22-33
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib import messages
from django.core.exceptions import ValidationError
import pyotp
from .models import UserTwoFactorAuthData

def enable_2fa(request):
    dummy_login_view(request)
    user = request.user
    totp_device = TOTPDevice.objects.create(user=user, confirmed=False)
    totp_device_url = totp_device.config_url()
    return render(request, 'enable_2fa.html', {'totp_device_url': totp_device_url})
# @login_required
# def enable_2fa(request):
#     user = request.user
#     if request.method == 'POST':
#         # Kullanıcı 2FA etkinleştirmeyi seçti
#         totp_device = TOTPDevice.objects.create(user=user, confirmed=False)
#         messages.success(request, 'Two-Factor Authentication enabled successfully!')
#         return redirect('enable_2fa')

#     return render(request, 'S_A_P/enable_2fa.html')


def user_two_factor_auth_data_create(*, user) -> UserTwoFactorAuthData:
    if hasattr(user, 'two_factor_auth_data'):
        raise ValidationError(
            'Can not have more than one 2FA related data.'
        )

    two_factor_auth_data = UserTwoFactorAuthData.objects.create(
        user=user,
        otp_secret=pyotp.random_base32()
    )

    return two_factor_auth_data

# @login_required
def home(request):
    return render(request, 'S_A_P/spa_main.html')
#end of 2fa section

#------------------------------------------------------------#

#qr code section line 72

# from typing import Optional

# from django.db import models
# from django.conf import settings

# import pyotp
# import qrcode
# import qrcode.image.svg


# class UserTwoFactorAuthData(models.Model):
#     user = models.OneToOneField(
#         settings.AUTH_USER_MODEL,
#         related_name='two_factor_auth_data',
#         on_delete=models.CASCADE
#     )

#     otp_secret = models.CharField(max_length=255)

#     def generate_qr_code(self, name: Optional[str] = None) -> str:
#         totp = pyotp.TOTP(self.otp_secret)
#         qr_uri = totp.provisioning_uri(
#             name=name,
#             issuer_name='Styleguide Example Admin 2FA Demo'
#         )

#         image_factory = qrcode.image.svg.SvgPathImage
#         qr_code_image = qrcode.make(
#             qr_uri,
#             image_factory=image_factory
#         )

#         # The result is going to be an HTML <svg> tag
#         return qr_code_image.to_string().decode('utf_8')
#end of qr code section

#------------------------------------------------------------#

#templateViev section line 111-114

from django.core.exceptions import ValidationError
from django.views.generic import TemplateView

# from .services import user_two_factor_auth_data_create


class AdminSetupTwoFactorAuthView(TemplateView):
    template_name = "S_A_P/enable_2fa.html"

    def post(self, request):
        dummy_login_view(request)
        context = {}
        user = request.user

        try:
            two_factor_auth_data = user_two_factor_auth_data_create(user=user)
            otp_secret = two_factor_auth_data.otp_secret

            context["otp_secret"] = otp_secret
            context["qr_code"] = two_factor_auth_data.generate_qr_code(
                name=user.email
            )
        except ValidationError as exc:
            context["form_errors"] = exc.messages

        return self.render_to_response(context)
#end of templateViev section

#------------------------------------------------------------#

#create dummy user section line 143-


from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import redirect

def create_and_login_dummy_user(request):
    # Yeni bir kullanıcı oluştur
    user = User.objects.create_user(username='dummy_user10', password='dummy_password3')

    # Oturumu aç
    login(request, user)

    # İstenirse, kullanıcıyı bir sayfaya yönlendir
    # return redirect('istenen_sayfa_urlsi')

def dummy_login_view(request):
    create_and_login_dummy_user(request)
    return HttpResponse("Yalan kullanıcı başarıyla oturum açtı!")

#------------------------------------------------------------#

def spa_main(request):
    validate = request.GET.get('code', None)
    if validate:
        user_data = get_42_token(request)
        print("user_data: \n")
        print(user_data.get('login'))
        print(user_data.get('email'))
        test = create_jwt_token(user_data)
        print("test: \n" + test)
        return render(request, 'S_A_P/spa_page.html', {'user_data': user_data})
    return render(request, 'S_A_P/spa_main.html')

def spa_page(request):
    return render(request, 'S_A_P/spa_page.html')

def form_submission(request):
    if request.method == 'POST':
        form = YourModelForm(request.POST)
        if form.is_valid():
            form.save()
            # Optionally, you can redirect the user to another page after form submission
            return JsonResponse({'success': True})
    else:
        form = YourModelForm()

    return render(request, 'S_A_P/form_submission.html', {'form': form})
#------------------------------------------------------------#
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
        "redirect_uri": "http://10.12.11.4:8000", #kontrol edilcek
    }
    response = requests.post(token_url, data=token_params)

    if response.status_code == 200:
        access_token = response.json().get("access_token")

        profile_url = "https://api.intra.42.fr/v2/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        print("headers: \n")
        print(headers)
        profile_response = requests.get(profile_url, headers=headers)

        if profile_response.status_code == 200:
            user_data = profile_response.json()
            return user_data
        else:
            return {"error": "Unable to fetch user profile"}

    else:
        return {"error": "Unable to obtain access token"}

def get_42_api_data(request):

    UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
    SECRET = "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"
    # token_url = "https://api.intra.42.fr/oauth/token"
    AUTHORIZATION_URL = "https://api.intra.42.fr/oauth/authorize"

    authorization_params = {
        "client_id": UID,
        "redirect_uri": "http://10.12.11.4:8000",
        "response_type": "code",
        "scope": "public",
    }
    authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"
    print("authorization_url: \n")
    print(authorization_url)
    return (authorization_url)
    # if request.method == 'GET':
    # return redirect(authorization_url)

# def ft_login(request):
#     user_data = get_42_api_data(request)
#     get_42_token(request)

#     return redirect(request, 'S_A_P/spa_page.html', {'user_data': user_data})

def ft_login(request):
    # authorization_url = 
    return render(request, 'S_A_P/auth.html', {'authorization_url': get_42_api_data(request)})