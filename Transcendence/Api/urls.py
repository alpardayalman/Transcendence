from django.urls import path
import Api.Profile.views as profile_views
import Api.Chat.views as chat_views
import Api.TwoFa.views as TwoFa_views
import Api.FtAuth.views as ft_views
import Api.views as views
import Api.Match.views as match_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView
import Api.Pong.views as pong_views
import Api.Gdpr.views as gdpr_views

urlpatterns = [
    # profil
    path('profile/', profile_views.product_alt_view),
    path('profile/<username>/', profile_views.product_alt_view),
    path('profile/<username>/edit/', profile_views.product_alt_view),

    # Chat
    path('block/', chat_views.UserBlockAPIView.as_view(), name='block'),

    # Two Fa
    path('two-fa/', TwoFa_views.two_fa.as_view(), name='two_fa'),
    path('enable-2fa/', TwoFa_views.enable_2fa.as_view(), name='enable_2fa'),
    path('disable-2fa/', TwoFa_views.disable_2fa.as_view(), name='disable_2fa'),
    path('verify-2fa/', TwoFa_views.verify_2fa.as_view(), name='verify_2fa'),

    # 42 Auth
    path('login_with_42/', ft_views.LoginWithFourtyTwoAuth.as_view(), name='login_with_42'),
    path('redirect_auth/', ft_views.CallbackView.as_view(), name='callback'),
    
    # General Login Register
    path('check/login/', views.CheckLoginStatus.as_view(), name='check_login_status'),
    path('login/', views.UserLoginAPIView.as_view(), name="api-login"),
    path('register/', views.UserRegisterAPIView.as_view(), name="api-register"),

    # Match
    path('match/', match_views.MatchPostAPIView.as_view(), name="match"),
    path('matchget/<str:username>/', match_views.MatchGetAPIView.as_view(), name="matchget"),

    # Pong
    path('ponginvite/', pong_views.PongInviteCreateAPIView.as_view(), name="ponginvitepost"),
    path('ponginviteget/<str:inv_id>', pong_views.PongInviteGetAPIView.as_view(), name="ponginviteget"),
    path('ponginviteput/<str:inv_id>', pong_views.PongInviteUpdateAPIView.as_view(), name="ponginviteput"),
    path('ponginvitedel/<str:inv_id>', pong_views.PongInviteDeleteAPIView.as_view() , name="ponginvitedel"),

    # Token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='blacklist_token'),

    # GDPR
    path('delete/<str:username>/', gdpr_views.DeleteObjectView.as_view(), name='gdpr_delete'),

]