from django.contrib import admin
from .models import TwitterCredential, TwitterStats, InstagramCredential, InstagramStats, SocialAccount, YouTubeStats

# Register your models here.
admin.site.register(SocialAccount)
admin.site.register(YouTubeStats)
admin.site.register(TwitterCredential)
admin.site.register(TwitterStats)
admin.site.register(InstagramCredential)
admin.site.register(InstagramStats)
