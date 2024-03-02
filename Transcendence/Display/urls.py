# urls.py in Django
from django.urls import path
from Display.views import *
from Api import views as Api_views
from Chat import views as Chat_views
from Pong import views as Pong_views

urlpatterns = [

    path('logout', logoutUser, name="logout"),
#    path('form-submission/', form_submission, name='form_submission'),

#	HOME PAGE
	path('', basePage, name='basePage'),
    path('login/', basePage, name='basePage'),
#	HOME ENDPOINTS
	path('get-file/home/<str:filename>', homePage, name='homePage'),

#	PROFILE PAGE
	path('profile', basePage, name='basePage'),
#	PROFILE ENDPOINTS
	path('get-file/profile/<str:filename>', profilePage, name='homePage'),

#   42 Auth redirection.

#   ---------------------------------------------------------------------------------------------------------------------------
#	SETTINGS PAGE
	path('settings', basePage, name='basePage'),
#	SETTINGS ENDPOINTS
	path('get-file/settings/<str:filename>', settingsPage, name='settingsPage'),

	path('settings_2fa', basePage, name='basePage'),
	path('get-file/settings_2fa/<str:filename>', settingsPage2fa, name='settingsPage2fa'),

	path('settings_password_change', basePage, name='basePage'),
	path('get-file/settings_password_change/<str:filename>', settingsPagePasswordChange, name='settingsPagePasswordChange'),

#   ---------------------------------------------------------------------------------------------------------------------------
#   LOGIN PAGE
    path('login', basePage, name='login'),
#   LOGIN ENDPOINTS
    path('get-file/login/<str:filename>', loginPage, name='loginPage'),

#   REGISTER PAGE
    path('register', basePage, name='register'),
#   REGISTER ENDPOINTS
    path('get-file/register/<str:filename>', registerPage, name='registerPage'),


#   CHAT PAGE
	path('chat', basePage, name='basePage'),
#   CHAT ENDPOINTS
    path('get-file/chat/<str:filename>', Chat_views.chatPage, name='chatPage'),

#   About Page
    path('about', basePage, name='basePage'),
#   About ENDPOINTS
    path('get-file/about/<str:filename>', aboutPage, name='aboutPage'),

#	Game Page
	path('pong', basePage, name='basePage'),
	path('get-file/pong/<str:filename>', Pong_views.pongPage, name='pongPage'),

# Add other URL patterns or catch-all patterns

#   tournament Page
    path('tournament', basePage, name='basePage'),
#   tournament ENDPOINTS
    path('get-file/tournament/<str:filename>', tournamentPage, name='tournamentPage'),

#   Vs Page
    path('vs', basePage, name='basePage'),
#   vs ENDPOINTS
    path('get-file/vs/<str:filename>', vsPage, name='vsPage'),


]