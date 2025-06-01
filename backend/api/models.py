from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class SocialAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    youtube = models.BooleanField(default=False)
    twitter = models.BooleanField(default=False)
    instagram = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"


class TwitterCredential(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    twitter_username = models.CharField(max_length=255)
    access_token = models.CharField(max_length=255)
    access_token_secret = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.twitter_username}"


class TwitterStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    followers_count = models.IntegerField()
    tweets_count = models.IntegerField()
    likes_count = models.IntegerField()
    recorded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Stats for {self.user.username} at {self.recorded_at}"
