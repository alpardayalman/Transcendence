from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.template import Context, loader

# Create your views here.

def home(request):
    print("def home(request)")
    context = {
        "username": "Sarbi"
    }
    return render(request, 'page/index.html', context)

def game(request, num):
    context = {
        "username": "alpi",
    }
    if num == 2:
        template = loader.get_template("page/test.js")
        return HttpResponse(template.render(context))
    template = loader.get_template("page/game.html")
    return HttpResponse(template.render(context))