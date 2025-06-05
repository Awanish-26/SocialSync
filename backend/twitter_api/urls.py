from django.urls import path
from .views import (
    TwitterAuthInitiateView,
    TwitterAuthCallbackView,
    TwitterStatsView,
    TwitterDisconnectView,
)

urlpatterns = [
    path('initiate/', TwitterAuthInitiateView.as_view(), name='twitter_login'),
    path('callback/', TwitterAuthCallbackView.as_view(), name='twitter_callback'),
    path('stats/', TwitterStatsView.as_view(), name='twitter_stats'),
    path('disconnect/', TwitterDisconnectView.as_view(), name='twitter_disconnect'),
]
