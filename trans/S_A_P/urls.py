# urls.py in Django
from django.urls import path
from .views import *
from .twofa import views

urlpatterns = [
    path('register/', registerPage, name="register"),
    path('login/', loginPage, name="login"),
    path('logout/', logoutUser, name="logout"),
#    path('', spa_main, name='spa_main'),
#    path('spa-page/', spa_page, name='spa_page'),
#    path('form-submission/', form_submission, name='form_submission'),
#    path('profile/', profile, name='profile'),
#    path('profile_js/', profile_js, name='profile_js'),
    path('two-fa/', views.two_fa, name='two_fa'),
    path('enable-2fa/', views.enable_2fa, name='enable_2fa'),
    path('disable-2fa/', views.disable_2fa, name='disable_2fa'),
    path('verify-2fa/', views.verify_2fa, name='verify_2fa'),
    path('login-with-42/', views.loginWithFourtyTwoAuth, name='login_with_42'),
    path('redirect_auth/', views.redirect_auth, name='redirect_auth'),

#	HOME PAGE
	path('', basePage, name='basePage'),
#	HOME ENDPOINTS
	path('get-file/home/<str:filename>', homePage, name='homePage'),

#	PROFILE PAGE
	path('profile', basePage, name='basePage'),
#	PROFILE ENDPOINTS
	path('get-file/profile/<str:filename>', profilePage, name='homePage'),

#	SETTINGS PAGE
	path('settings', basePage, name='basePage'),
#	SETTINGS ENDPOINTS
	path('get-file/settings/<str:filename>', settingsPage, name='settingsPage'),


	path('chat/', basePage, name='basePage'),
	path('game/', basePage, name='basePage'),

    # Add other URL patterns or catch-all patterns
]
