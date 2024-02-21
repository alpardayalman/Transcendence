# urls.py in Django
from django.urls import path
from Display.views import *
from Api import views as Api_views
from Chat import views as Chat_views

urlpatterns = [

    path('register/', registerPage, name="register"),
    # path('login/', loginPage, name="login"),
    path('logout', logoutUser, name="logout"),
#    path('', spa_main, name='spa_main'),
#    path('form-submission/', form_submission, name='form_submission'),
#    path('profile/', profile, name='profile'),
#    path('profile_js/', profile_js, name='profile_js'),
    path('two-fa/', Api_views.two_fa, name='two_fa'),
    path('enable-2fa/', Api_views.enable_2fa, name='enable_2fa'),
    path('disable-2fa/', Api_views.disable_2fa, name='disable_2fa'),
    path('verify-2fa/', Api_views.verify_2fa, name='verify_2fa'),
    path('login-with-42/', Api_views.loginWithFourtyTwoAuth, name='login_with_42'),
    path('redirect_auth/', Api_views.redirect_auth, name='redirect_auth'),

    path('api/login/', Api_views.UserLoginAPIView.as_view(), name="api-login"),
    path('api/register/', UserRegisterAPIView.as_view(), name="api-register"),
    path('check/login/', Api_views.CheckLoginStatus.as_view(), name='check_login_status'),

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
