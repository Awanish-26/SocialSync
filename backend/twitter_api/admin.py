from django.contrib import admin
from .models import TwitterOAuth2Token


@admin.register(TwitterOAuth2Token)
class TwitterOAuth2TokenAdmin(admin.ModelAdmin):
    pass
