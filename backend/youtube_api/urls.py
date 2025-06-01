from django.urls import path
from .views import (
    YouTubeAuthInitiateView,
    YouTubeAuthCallbackView,
    YouTubeStatsView,
    YouTubeDisconnectView
)

urlpatterns = [
    path('initiate/', YouTubeAuthInitiateView.as_view(),
         name='youtube_auth_initiate'),
    path('callback/', YouTubeAuthCallbackView.as_view(),
         name='youtube_auth_callback'),
    path('stats/', YouTubeStatsView.as_view(), name='youtube_stats'),
    path('disconnect/', YouTubeDisconnectView.as_view(), name='youtube_disconnect'),
]
