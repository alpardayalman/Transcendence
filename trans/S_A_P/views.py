# Create your views here.
from .forms import YourModelForm, CreateUserForm
# from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.template import Context, loader
from chat.models import CustomUser
from .twofa.views import *



# jwt ekleme

def registerPage(request):
    if request.user.is_authenticated:
        return redirect('spa_main')
    else:
        form = CreateUserForm()
        if request.method == 'POST':
            form = CreateUserForm(request.POST)
            if form.is_valid():
                form.save()
                user = form.cleaned_data.get('username')
                messages.success(request, 'Account was created for ' + user)
                return redirect('login')
    
        context = {'form':form}
        return render(request, 'SPA/register.html', context)

def logoutUser(request):
    logout(request)
    return redirect('login')

# Create your views here.
@login_required(login_url='login')
def spa_main(request):
    return render(request, 'SPA/spa_main.html')

@login_required(login_url='login')
def spa_page(request):
    return render(request, 'SPA/spa_page.html')

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

    return render(request, 'SPA/form_submission.html', {'form': form})

@login_required(login_url='login')
def profile_js(request):
    template = loader.get_template("SPA/profile.js")
    return HttpResponse(template.render())

@login_required(login_url='login')
def profile(request):
    return render(request, 'SPA/profile.html')

def basePage(request):
	return render(request, 'SPA/base.html')

@login_required(login_url='login')
def homePage(request, filename):
	if filename == "home.css":
		return HttpResponse("home.css geldi")
	return HttpResponse("sarp")

@login_required(login_url='login')
def profilePage(request, filename):
	context = {
		"username": request.user.username,
	}
	temp = loader.get_template("SPA/profile.html")
	# if filename == "profile.html":
	return HttpResponse(temp.render(context))

@login_required(login_url='login')
def settingsPage(request, filename):
	temp = loader.get_template('SPA/settings.html')
	return HttpResponse(temp.render())

def loginPage(request, filename):
    temp = loader.get_template('SPA/login.html')
    return HttpResponse(temp.render())