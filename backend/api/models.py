from django.db import models
from django.contrib.auth.models import User


class SocialAccount(models.Model):
    PLATFORM_CHOICES = [
        ('youtube', 'YouTube'),
        ('instagram', 'Instagram'),
        ('x', 'X (Twitter)'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    connected = models.BooleanField(default=False)
    channel_id = models.CharField(
        max_length=255, blank=True, null=True)  # for YouTube
    # optional for OAuth platforms
    access_token = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.platform}"


class YouTubeStats(models.Model):
    social_account = models.ForeignKey(SocialAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    subscriber_count = models.IntegerField()
    view_count = models.BigIntegerField()
    video_count = models.IntegerField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"YouTube Stats for {self.social_account.user.username}"
