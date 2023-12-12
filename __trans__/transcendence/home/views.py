from django.shortcuts import render
# from django.http import HttpResponse
# from django.template import Context, loader
# from rest_framework_swagger.views import get_swagger_view

# Create your views here.

def index(request):
    # template = loader.get_template('index.html')
    return render(request, 'index.html')

# def schema(request):
#     schema = get_swagger_view(title='Transcendence API')
#     return render(request, schema)