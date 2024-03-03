from django.urls import path
import Api.views as views
import Api.Profile.serializer as profile_serializer
import Api.Chat.views as chat_views
import Api.Match.views as match_views
import Api.Profile.views as profile_views
import Api.Pong.views as pong_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView

urlpatterns = [
    # eski profil urls.py
    path('profile/', profile_views.product_alt_view),
    path('profile/<username>/', profile_views.product_alt_view),

    # Chat
    path('block/', chat_views.UserBlockAPIView.as_view(), name='block'),

    path('two-fa/', views.two_fa, name='two_fa'),
    path('enable-2fa/', views.enable_2fa, name='enable_2fa'),
    path('disable-2fa/', views.disable_2fa, name='disable_2fa'),
    path('verify-2fa/', views.verify_2fa, name='verify_2fa'),
    path('login_with_42/', views.LoginWithFourtyTwoAuth.as_view(), name='login_with_42'),
    path('redirect_auth/', views.CallbackView.as_view(), name='callback'),
    # path('redirect_auth/', views.redirect_auth, name='redirect_auth'),
    
    # API'lari buraya tasidik.
    path('check/login/', views.CheckLoginStatus.as_view(), name='check_login_status'),
    path('login/', views.UserLoginAPIView.as_view(), name="api-login"),
    path('register/', views.UserRegisterAPIView.as_view(), name="api-register"),

    # Match
    path('match/', match_views.MatchListAPIView.as_view(), name="match"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # kullanıcının geçerli bir JWT'ye sahip olduğu ve bu JWT'nin geçerlilik süresi dolmaya yaklaştığında, geçerli JWT'yi yenilemek için bir endpoint sağlamaktır.
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='blacklist_token'),

    path('ponginvite/', pong_views.PongInviteCreateAPIView.as_view(), name="ponginvitepost"),
    path('ponginviteget/<str:inv_id>', pong_views.PongInviteGetAPIView.as_view(), name="ponginviteget"),
    path('ponginviteput/', pong_views.PongInviteUpdateAPIView.as_view(), name="ponginviteput"),
	path('pCheck/', views.playerCheck, name="pCheck"),
]