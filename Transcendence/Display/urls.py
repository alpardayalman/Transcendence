# urls.py in Django
from django.urls import path
from Display.views import *
from Api import views as Api_views
from Chat import views as Chat_views

urlpatterns = [

    path('logout', logoutUser, name="logout"),
#    path('form-submission/', form_submission, name='form_submission'),

#	HOME PAGE
	path('', basePage, name='basePage'),
#	HOME ENDPOINTS
	path('get-file/home/<str:filename>', homePage, name='homePage'),

#	PROFILE PAGE
	path('profile', basePage, name='basePage'),
#	PROFILE ENDPOINTS
	path('get-file/profile/<str:filename>', profilePage, name='homePage'),

    path('redirect_auth/', Api_views.CallbackView, name='callback'),

#	SETTINGS PAGE
	path('settings', basePage, name='basePage'),
#	SETTINGS ENDPOINTS
	path('get-file/settings/<str:filename>', settingsPage, name='settingsPage'),

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

#   GAME PAGE
	path('gameInterface', basePage, name='basePage'),
#   GAME ENDPOINTS
    path('get-file/gameInterface/<str:filename>', gameInterfacePage, name='gamePage'),
    # Add other URL patterns or catch-all patterns
]
