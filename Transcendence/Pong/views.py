from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.template import Context, loader

# Create your views here.

def pongPage(request, filename):
	temp = loader.get_template('Display/pong.html');
	return HttpResponse(temp.render())
