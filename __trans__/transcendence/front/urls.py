from django.urls import path
from .views import *
urlpatterns = [
    path('', base, name='base'),
    path('api/home/', home, name='home'),
    path('api/login/', login, name='login'),
    path('<str:page>', base, name='base')
]