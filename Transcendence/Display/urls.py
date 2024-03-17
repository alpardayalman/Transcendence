# urls.py in Django
from django.urls import path
from Display.views import *
from Chat import views as Chat_views
from Pong import views as Pong_views

urlpatterns = [

    path('logout', logoutUser, name="logout"),

#	HOME PAGE
	path('', basePage, name='basePage'),
    path('login/', basePage, name='basePage'),
#	HOME ENDPOINTS
	path('get-file/home/<str:filename>', homePage, name='homePage'),

#	PROFILE PAGE
	path('profile', basePage, name='basePage'),
    path('profile/<str:username>', customSomething, name='customSomething'),
    path('get-file/username', customProfile, name='customProfile'),
#	PROFILE ENDPOINTS
	path('get-file/profile/<str:filename>', profilePage, name='homePage'),


#   ---------------------------------------------------------------------------------------------------------------------------
#	SETTINGS PAGE
	path('settings', basePage, name='basePage'),
#	SETTINGS ENDPOINTS
	path('get-file/settings/<str:filename>', settingsPage, name='settingsPage'),

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

#   42 Auth redirection.
    path('ft_login/', basePage, name='basePage'),
]