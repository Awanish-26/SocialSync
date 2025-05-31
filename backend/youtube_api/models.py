# youtube_integration/models.py
from django.db import models
from django.conf import settings  # To link to your User model


class YouTubeCredentials(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    access_token = models.TextField()
    # Refresh tokens are long-lived
    refresh_token = models.TextField(null=True, blank=True)
    # Store when the access token expires
    token_expiry = models.DateTimeField(null=True, blank=True)
    # Store the granted scopes
    scopes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s YouTube Credentials"

    @property
    def is_valid(self):
        from django.utils import timezone
        return self.access_token and self.token_expiry and self.token_expiry > timezone.now()
