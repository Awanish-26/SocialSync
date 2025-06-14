
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('youtube/', include('youtube_api.urls')),
    path('twitter/', include('twitter_api.urls')),
]
