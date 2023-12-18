from django.http import Http404, HttpResponse
from django.shortcuts import render

# from django.template import Context, loader
# from rest_framework_swagger.views import get_swagger_view

# Create your views here.

def index(request):
    # template = loader.get_template('index.html')
    return render(request, 'index.html')


# def schema(request):
#     schema = get_swagger_view(title='Transcendence API')
#     return render(request, schema)

#randomstring = ["This is section 1.","This is section 2.", "This is section 3."]

#def section(request, num):
#    if num <= 3:
#        return HttpResponse(randomstring[num-1])
#    else:
#        raise Http404('No such section')

