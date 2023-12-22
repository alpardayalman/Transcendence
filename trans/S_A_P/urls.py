# urls.py in Django
from django.urls import path
from .views import *

urlpatterns = [
    path('game/', game, name='game'),
    path('register/', registerPage, name="register"),
    path('login/', loginPage, name="login"),
    path('logout/', logoutUser, name="logout"),
    path('', spa_main, name='spa_main'),
    path('spa-page/', spa_page, name='spa_page'),
    path('form-submission/', form_submission, name='form_submission'),
    # Add other URL patterns or catch-all patterns
]
