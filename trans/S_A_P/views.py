# Create your views here.
from django.shortcuts import render, redirect
from .forms import YourModelForm, CreateUserForm
from django.http import JsonResponse
# from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

def loginPage(request):
    if request.user.is_authenticated:
        return redirect('spa_main')
    else:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('spa_main')
            else:
                messages.info(request, 'Username Or Password is incorect')

        context = {}
        return render(request, 'S_A_P/login.html', context)


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
        return render(request, 'S_A_P/register.html', context)

def logoutUser(request):
    logout(request)
    return redirect('login')

# Create your views here.
@login_required(login_url='login')
def spa_main(request):
    return render(request, 'S_A_P/spa_main.html')

@login_required(login_url='login')
def spa_page(request):
    return render(request, 'S_A_P/spa_page.html')

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

    return render(request, 'S_A_P/form_submission.html', {'form': form})

