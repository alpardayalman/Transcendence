# urls.py in Django
from django.urls import path
from .views import *
from .twofa import views

urlpatterns = [
    path('register/', registerPage, name="register"),
    path('login/', loginPage, name="login"),
    path('logout/', logoutUser, name="logout"),
    path('', spa_main, name='spa_main'),
    path('spa-page/', spa_page, name='spa_page'),
    path('form-submission/', form_submission, name='form_submission'),
    path('profile/', profile, name='profile'),
    path('profile_js/', profile_js, name='profile_js'),
    path('auth-check/<str:pin>/', views.AuthCheckView.as_view()),
    path('two-fa/', views.two_fa, name='two_fa'),
    path('enable-2fa/', views.enable_2fa, name='enable_2fa'),
    path('disable-2fa/', views.disable_2fa, name='disable_2fa'),
    path('verify-2fa/', views.verify_2fa, name='verify_2fa'),
    path('login-with-42/', views.login_with_42, name='login_with_42'),
    # Add other URL patterns or catch-all patterns
]
