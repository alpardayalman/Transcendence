from django.urls import path
import Api.serializers as serializer
import Api.views as views

urlpatterns = [
    # eski profil urls.py
    # direk serializer'i cagirmak mantikli degil api'in icinde serializeri kullanip verification yapabilirsin.
    path('profile/', serializer.ProfileGenericAPIView.as_view(), name='Profile'),
    path('score/', serializer.ScoreGenericAPIView.as_view(), name='Score'),



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
]