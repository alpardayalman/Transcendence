from django.shortcuts import render
from django.http import  HttpResponse
from django.template import loader
from Chat.models import CustomUser

def pongPage(request, filename):
	user = CustomUser.objects.get(username=request.user)
	context = {
		'user': user,
	}
	temp = loader.get_template('Display/pong.html')
	return HttpResponse(temp.render(context))
