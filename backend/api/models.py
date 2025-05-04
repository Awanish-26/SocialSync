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
    access_token = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.platform}"


class YouTubeStats(models.Model):
    social_account = models.ForeignKey(SocialAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    subscriber_count = models.IntegerField(default=0)
    view_count = models.BigIntegerField(default=0)
    video_count = models.IntegerField(default=0)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"YouTube Stats for {self.social_account.user.username}"


# Instagram Engagement Model


class InstagramCredential(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    instagram_username = models.CharField(max_length=255)
    # Consider encrypting or storing a session token securely
    instagram_password = models.CharField(max_length=255)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Instagram Account"


class InstagramStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    total_likes = models.IntegerField()
    total_comments = models.IntegerField()
    total_posts_checked = models.IntegerField()
    avg_likes = models.FloatField()
    avg_comments = models.FloatField()

    def __str__(self):
        return f"{self.user.username} stats at {self.timestamp}"


class TwitterCredential(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    twitter_username = models.CharField(max_length=255)
    access_token = models.CharField(max_length=255)
    access_token_secret = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.twitter_username}"


class TwitterStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    followers_count = models.IntegerField()
    tweets_count = models.IntegerField()
    likes_count = models.IntegerField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stats for {self.user.username} at {self.recorded_at}"
