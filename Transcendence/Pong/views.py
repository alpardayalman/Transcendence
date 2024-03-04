from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.template import Context, loader
from Chat.models import CustomUser
# Create your views here.

def pongPage(request, filename):
	user = CustomUser.objects.get(username=request.user)
	context = {
		'user': user,
	}
	temp = loader.get_template('Display/pong.html')
	return HttpResponse(temp.render(context))
