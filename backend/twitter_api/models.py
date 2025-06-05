from django.db import models
from django.contrib.auth.models import User


class TwitterOAuth2Token(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=512)
    refresh_token = models.CharField(max_length=512, blank=True, null=True)
    expires_in = models.IntegerField()
    scope = models.CharField(max_length=512)
    token_type = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} Twitter Token"
