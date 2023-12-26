import requests
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from S_A_P.forms import CreateUserForm

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



def get_42_api_data(request):

    UID = "u-s4t2ud-733e861ae2ebc443b4af345bacb7e547055620fa2b45b33120f3cfcdf967a614"
    SECRET = "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"
    AUTHORIZATION_URL = "https://api.intra.42.fr/oauth/authorize"

    authorization_params = {
        "client_id": UID,
        "redirect_uri": "http://10.12.11.4:8000/login",
        "response_type": "code",
        "scope": "public",
    }
    authorization_url = f"{AUTHORIZATION_URL}?client_id={authorization_params['client_id']}&redirect_uri={authorization_params['redirect_uri']}&response_type={authorization_params['response_type']}&scope={authorization_params['scope']}"
    print("authorization_url: \n")
    print(authorization_url)
    return (authorization_url)



def loginWithFourtyTwoAuth(request):
    user_data = get_42_token(request)
    if User.objects.get(username=user_data.get('login')):
        user = User.objects.get(username=user_data.get('login'))
        login(request, user)
        return redirect('spa_main')
    else:
        form = CreateUserForm()
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