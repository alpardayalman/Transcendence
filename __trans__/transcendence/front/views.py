from django.shortcuts import render
from .models import Register
# Create your views here.

def base(request):
    return render(request, 'base.html')

def login(request):
    if request.method == 'POST':
        csrftoken = request.POST['csrfmiddlewaretoken']
        csrftoken
        client = Register(fname=request.POST['fname'], lname=request.POST['lname'], email=request.POST['email'])
                        #   password=request.POST['password'], nickname=request.POST['nickname'], 
        client.save()
    return render(request, 'login.html')

def home(request):
    return render(request, 'home.html')