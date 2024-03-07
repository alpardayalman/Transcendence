# Create your views here.
from Display.forms import YourModelForm, CreateUserForm
# from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.template import Context, loader
from Chat.models import CustomUser
from Api.views import *
from rest_framework.status import HTTP_205_RESET_CONTENT

@login_required(login_url='login')
def logoutUser(request):
    try:
        request.user.online_status = False
        request.user.save()
        # Assuming you are using Simple JWT for token authentication
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            try:
                response = requests.post('http://localhost:8000/api/token/blacklist/',
                                        data={'refresh': refresh_token})
                response.raise_for_status()  # Raise exception for unsuccessful requests
            except requests.exceptions.RequestException as e:
                print("Error while blacklisting token: ")
        logout(request)

        return redirect('login')
    except Exception as e:
        return Response(status=HTTP_205_RESET_CONTENT)


@login_required(login_url='login')
def profile(request):
    return render(request, 'Display/profile.html')

def basePage(request):
	return render(request, 'Display/base.html')

@login_required(login_url='login')
def homePage(request, filename):
	if filename == "home.css":
		return HttpResponse("home.css geldi")
	return HttpResponse("sarp")

@login_required(login_url='login')
def profilePage(request, filename):
	context = {
		"username": request.user.username,
        "profile_photo": request.user.profile_photo.url,
	}
	temp = loader.get_template("Display/profile.html")
	# if filename == "profile.html":
	return HttpResponse(temp.render(context))

def loginPage(request, filename):
    temp = loader.get_template('Display/login.html')
    return HttpResponse(temp.render())

def registerPage(request, filename):
    temp = loader.get_template('Display/register.html')
    return HttpResponse(temp.render())

@login_required(login_url='login')
def aboutPage(request, filename):
    temp = loader.get_template('Display/about.html')
    return HttpResponse(temp.render())

@login_required(login_url='login')
def tournamentPage(request, filename):
    temp = loader.get_template('Display/tournament.html')
    return HttpResponse(temp.render())

@login_required(login_url='login')
def settingsPage(request, filename):
	user = CustomUser.objects.get(username=request.user)
	context = {
        'user': user,
    }
	temp = loader.get_template('Display/settings.html')
	return HttpResponse(temp.render(context))

@login_required(login_url='login')
def vsPage(request, filename):
	temp = loader.get_template('Display/vs.html')
	return HttpResponse(temp.render())

def customProfile(request):
    temp = loader.get_template('Display/username.html')
    context = { 
          "username": request.user.username,
    }
    return HttpResponse(temp.render(context))

def customSomething(requst, username):
    temp = loader.get_template('Display/base.html')
    return HttpResponse(temp.render()) 