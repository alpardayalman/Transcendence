from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.http import  HttpResponse
from django.template import loader
from Chat.models import CustomUser
from Api.views import *
from rest_framework.status import HTTP_205_RESET_CONTENT

@login_required(login_url='login')
def logoutUser(request):
    try:
        request.user.online_status = False
        request.user.save()
        # Assuming you are using Simple JWT for token authentication
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
		return HttpResponse("")
	return HttpResponse("home file not found")

@login_required(login_url='login')
def profilePage(request, filename):
	context = {
		"username": request.user.username,
	}
	temp = loader.get_template("Display/profile.html")
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
        "profile_photo": request.user.profile_picture.url,
    }
	temp = loader.get_template('Display/settings.html')
	return HttpResponse(temp.render(context))

@login_required(login_url='login')
def vsPage(request, filename):
	temp = loader.get_template('Display/vs.html')
	return HttpResponse(temp.render())

@login_required(login_url='login')
def customProfile(request):
    temp = loader.get_template('Display/username.html')
    context = { 
        "username": request.user.username,
        "profile_photo": request.user.profile_picture.url,
    }
    return HttpResponse(temp.render(context))

@login_required(login_url='login')
def customSomething(requst, username):
    temp = loader.get_template('Display/base.html')
    return HttpResponse(temp.render()) 