from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.twitter_login, name='twitter_login'),
    path('callback/', views.twitter_callback, name='twitter_callback'),
]
