from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    #path("<int:num>", views.section, name="section")
]
