from django.urls import path
from .views import SignupView, CustomTokenObtainPairView, connect_youtube, get_youtube_status, get_youtube_stats, refresh_youtube_stats, disconnect_youtube
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("youtube/connect/", connect_youtube, name="connect_youtube"),
    path("youtube/status/", get_youtube_status, name="get_youtube_status"),
    path("youtube/stats/", get_youtube_stats, name="get_youtube_stats"),
    path("youtube/refresh/", refresh_youtube_stats, name="refresh_youtube_stats"),
    path("youtube/disconnect/", disconnect_youtube, name="disconnect_youtube"),

]
