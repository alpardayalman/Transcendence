from django.urls import path
import Api.serializers as serializer

urlpatterns = [
    # eski profil urls.py
    path('profile/', serializer.ProfileGenericAPIView.as_view(), name='Profile'),
    path('score/', serializer.ScoreGenericAPIView.as_view(), name='Score'),

    
]