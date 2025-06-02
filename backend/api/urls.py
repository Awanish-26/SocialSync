from django.urls import path
from .views import (
    SignupView,
    CustomTokenObtainPairView,
    connect_twitter,
    disconnect_twitter,
    refresh_twitter_stats,
    get_twitter_status,
    get_account_status,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('account_status/', get_account_status, name='get_account_status'),
    # Twitter endpoints
    path('twitter/connect/', connect_twitter, name='connect_twitter'),
    path('twitter/status/', get_twitter_status, name='get_twitter_status'),
    path('twitter/refresh/', refresh_twitter_stats, name='refresh_twitter_stats'),
    path('twitter/disconnect/', disconnect_twitter, name='disconnect_twitter'),
]
