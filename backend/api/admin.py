from django.contrib import admin
from .models import TwitterCredential, TwitterStats, SocialAccount

# Register your models here.
admin.site.register(SocialAccount)
admin.site.register(TwitterCredential)
admin.site.register(TwitterStats)
