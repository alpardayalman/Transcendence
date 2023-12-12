from django.shortcuts import render
from django import template
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

register = template.Library()

class client:
    ip = str
    fname = str
    lname = str
    age = int
    def __init__(self):
        pass

    def __redr__(self):
        print(f"fname:{self.fname} lname:{self.lname} age:{self.age}.")

    def get_name(self):
        return self.name

    def get_age(self):
        return self.age

pepo = client

def login(request):
    if request.method == 'POST':
        pepo.fname = request.POST.get('fname')
        pepo.lname = request.POST.get('lname')
        pepo.age = request.POST.get('age')
        # for i in request.META:
        #     print(f"{i}:{request.META[i]}")
    return render(request, 'login.html', {'client':pepo})

