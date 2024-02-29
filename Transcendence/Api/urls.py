from django.urls import path
import Api.views as views
import Api.Profile.serializer as profile_serializer
import Api.Chat.views as chat_views

import Api.Match.views as match_views

urlpatterns = [
    # eski profil urls.py
    path('profile/', profile_serializer.ProfileGenericAPIView.as_view(), name='Profile'),
    path('score/', profile_serializer.ScoreGenericAPIView.as_view(), name='Score'),

    # Chat
    path('block/', chat_views.UserBlockAPIView.as_view(), name='block'),

    path('two-fa/', views.two_fa, name='two_fa'),
    path('enable-2fa/', views.enable_2fa, name='enable_2fa'),
    path('disable-2fa/', views.disable_2fa, name='disable_2fa'),
    path('verify-2fa/', views.verify_2fa, name='verify_2fa'),
    path('login_with_42/', views.LoginWithFourtyTwoAuth.as_view(), name='login_with_42'),
    # path('redirect_auth/', views.redirect_auth, name='redirect_auth'),
    
    # API'lari buraya tasidik.
    path('check/login/', views.CheckLoginStatus.as_view(), name='check_login_status'),
    path('login/', views.UserLoginAPIView.as_view(), name="api-login"),
    path('register/', views.UserRegisterAPIView.as_view(), name="api-register"),

    # Match
    path('match/', match_views.MatchwListAPIView.as_view(), name="match"),

	path('pCheck/', views.playerCheck, name="pCheck"),
]