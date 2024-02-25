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



@login_required(login_url='login')
def logoutUser(request):
    logout(request)
    return redirect('login')

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

@login_required(login_url='login')
def settingsPage(request, filename):
	temp = loader.get_template('Display/settings.html')
	return HttpResponse(temp.render())

def loginPage(request, filename):
    temp = loader.get_template('Display/login.html')
    return HttpResponse(temp.render())

def registerPage(request, filename):
    temp = loader.get_template('Display/register.html')
    return HttpResponse(temp.render())

@login_required(login_url='login')
def gameInterfacePage(request, filename):
    temp = loader.get_template('Display/gameInterface.html')
    return HttpResponse(temp.render())

@login_required(login_url='login')
def aboutPage(request, filename):
    temp = loader.get_template('Display/about.html')
    return HttpResponse(temp.render())