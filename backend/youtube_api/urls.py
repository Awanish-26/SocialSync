# youtube_integration/urls.py
from django.urls import path
from .views import (
    YouTubeAuthInitiateView,
    YouTubeAuthCallbackView,
    YouTubeChannelInfoView,
    YouTubePostCommentView
)

urlpatterns = [
    path('youtube/initiate/', YouTubeAuthInitiateView.as_view(),
         name='youtube_auth_initiate'),
    path('youtube/channel-info/', YouTubeChannelInfoView.as_view(),
         name='youtube_channel_info'),
    path('youtube/post-comment/', YouTubePostCommentView.as_view(),
         name='youtube_post_comment'),
]
