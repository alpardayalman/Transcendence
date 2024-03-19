from rest_framework.permissions import IsAuthenticated
from io import BytesIO
import pyotp
import qrcode
import base64
from Api.models import AuthInfo
from rest_framework.response import Response
from rest_framework.views import APIView
from Chat.models import CustomUser
from django.contrib.auth import login


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
