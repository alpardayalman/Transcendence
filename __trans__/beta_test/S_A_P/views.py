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