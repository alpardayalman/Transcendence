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



import logging
from rest_framework.status import HTTP_205_RESET_CONTENT
logger = logging.getLogger("yarrak.txt")  # Configure logger for this module

@login_required(login_url='login')
def logoutUser(request):
    try:
        # Assuming you are using Simple JWT for token authentication
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            try:
                # Blacklist logic using external API (replace with your implementation)
                response = requests.post('http://localhost:8000/api/token/blacklist/',
                                        data={'refresh': refresh_token})
                response.raise_for_status()  # Raise exception for unsuccessful requests
            except requests.exceptions.RequestException as e:
                logger.error(f"Failed to blacklist token: {e}")
            else:
                logger.info("Successfully blacklisted refresh token.")

        # Logout the user
        logout(request)

        return redirect('login')
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return Response(status=HTTP_205_RESET_CONTENT)

# Create your views here.
@login_required(login_url='login')
def spa_main(request):
    return render(request, 'Display/spa_main.html')

@login_required(login_url='login')
def form_submission(request):
    if request.method == 'POST':
        if not request.POST.get('field4'):
            messages.error(request, 'Username Or Password is incorect')
            return JsonResponse({'success': False})
        form = YourModelForm(request.POST)
        if form.is_valid():
            form.save()
            # Optionally, you can redirect the user to another page after form submission
            return JsonResponse({'success': True})
    else:
        form = YourModelForm()

    return render(request, 'Display/form_submission.html', {'form': form})

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
	temp = loader.get_template('Display/settings.html')
	return HttpResponse(temp.render())

@login_required(login_url='login')
def settingsPage2fa(request, filename):
	temp = loader.get_template('Display/settings_2fa.html')
	return HttpResponse(temp.render())

@login_required(login_url='login')
def settingsPagePasswordChange(request, filename):
	temp = loader.get_template('Display/settings_password_change.html')
	return HttpResponse(temp.render())

@login_required(login_url='login')
def vsPage(request, filename):
	temp = loader.get_template('Display/vs.html')
	return HttpResponse(temp.render())