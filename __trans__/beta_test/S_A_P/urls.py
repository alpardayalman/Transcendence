# urls.py in Django
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', spa_main, name='spa_main'),
    path('spa-page/', spa_page, name='spa_page'),
    path('form-submission/', form_submission, name='form_submission'),
    path('ft-login/', ft_login, name='ft_login'),
    path('two_factor/', include('two_factor.urls', 'two_factor')),
    # Add other URL patterns or catch-all patterns
]
