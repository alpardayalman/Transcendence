from django.shortcuts import render
from django.views import View
from .models import AuthInfo
import pyotp
from django.http import JsonResponse

class AuthCheckView(View):
    def get(self, request, pin):
        auth_info_details = AuthInfo.objects.first()
        secret_key = auth_info_details.secret_key
        totp = pyotp.TOTP(secret_key)
        status = totp.verify(pin)
        return JsonResponse({"status": True if status else False, "data": secret_key})