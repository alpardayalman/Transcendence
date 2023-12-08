from django.shortcuts import render
from django import template
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

register = template.Library()

class pep:
    def __init__(self):
        self.name = "*init*"
        self.age = "*init*"

    def get_name(self):
        return self.name

    def get_age(self):
        return self.age

pepo = pep()

def login(request):
    if request.method == 'POST':
        pepo.name = request.POST.get('name')
        pepo.age = request.POST.get('age')
        return render(request, 'output.html', { pepo })
    return render(request, 'login.html')

# def input(request):
#     if request.method == 'POST':
#         pepo.name = request.POST.get('name')
#         pepo.age = request.POST.get('age')
#         return render(request, 'output.html', pepo)
#     else:
#         return render(request, 'login.html')

