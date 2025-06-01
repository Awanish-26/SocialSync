from django.contrib import admin
from .models import YouTubeCredentials
# Register your models here.


@admin.register(YouTubeCredentials)
class YouTubeCredentialsAdmin(admin.ModelAdmin):
    pass
