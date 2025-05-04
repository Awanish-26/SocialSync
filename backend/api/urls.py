from django.urls import path
from .views import (
    SignupView,
    CustomTokenObtainPairView,
    connect_youtube,
    get_youtube_status,
    get_youtube_stats,
    refresh_youtube_stats,
    disconnect_youtube,
    fetch_instagram_engagement,
    InstagramStatusView,
    get_instagram_stats,
    refresh_instagram_stats,
    disconnect_instagram,
    connect_twitter,
    disconnect_twitter,
    get_twitter_stats,
    refresh_twitter_stats,
    get_twitter_status
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # youtube endpoints
    path("youtube/connect/", connect_youtube, name="connect_youtube"),
    path("youtube/status/", get_youtube_status, name="get_youtube_status"),
    path("youtube/stats/", get_youtube_stats, name="get_youtube_stats"),
    path("youtube/refresh/", refresh_youtube_stats, name="refresh_youtube_stats"),
    path("youtube/disconnect/", disconnect_youtube, name="disconnect_youtube"),
    # instagram endpoints
    path('instagram/connect/', fetch_instagram_engagement,
         name='connect_instagram'),
    path('instagram/status/', InstagramStatusView.as_view(),
         name='instagram-status'),
    path('instagram/stats/', get_instagram_stats, name='instagram-stats'),
    path('instagram/refresh/', refresh_instagram_stats, name='instagram-refresh'),
    path('instagram/disconnect/', disconnect_instagram,
         name='instagram-disconnect'),
    # Twitter endpoints
    path('twitter/connect/', connect_twitter, name='connect_twitter'),
    path('twitter/status/', get_twitter_status, name='get_twitter_status'),
    path('twitter/stats/', get_twitter_stats, name='get_twitter_stats'),
    path('twitter/refresh/', refresh_twitter_stats, name='refresh_twitter_stats'),
    path('twitter/disconnect/', disconnect_twitter, name='disconnect_twitter'),
]
