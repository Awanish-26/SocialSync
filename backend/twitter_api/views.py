from datetime import timedelta
import secrets
import base64
import hashlib
import requests
from datetime import datetime
from django.conf import settings
from urllib.parse import urlencode
from api.models import SocialAccount
from .models import TwitterOAuth2Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import HttpResponse, HttpResponseBadRequest

TWITTER_CLIENT_ID = settings.TWITTER_CLIENT_ID
TWITTER_CLIENT_SECRET = settings.TWITTER_CLIENT_SECRET
TWITTER_CALLBACK_URL = settings.TWITTER_CALLBACK_URL

AUTH_URL = "https://twitter.com/i/oauth2/authorize"
TOKEN_URL = "https://api.twitter.com/2/oauth2/token"
SCOPES = [
    "tweet.read", "tweet.write", "tweet.moderate.write",
    "users.read", "follows.read", "follows.write",
    "offline.access", "space.read", "mute.read", "mute.write",
    "like.read", "like.write", "list.read", "list.write",
    "block.read", "block.write", "bookmark.read", "bookmark.write"
]


def generate_pkce_pair():
    code_verifier = base64.urlsafe_b64encode(
        secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode('utf-8')).digest()
    ).rstrip(b'=').decode('utf-8')
    return code_verifier, code_challenge


class TwitterAuthInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        code_verifier, code_challenge = generate_pkce_pair()
        request.session['twitter_code_verifier'] = code_verifier
        params = {
            "response_type": "code",
            "client_id": TWITTER_CLIENT_ID,
            "redirect_uri": TWITTER_CALLBACK_URL,
            "scope": " ".join(SCOPES),
            "state": secrets.token_urlsafe(16),
            "code_challenge": code_challenge,
            "code_challenge_method": "S256"
        }
        url = f"{AUTH_URL}?{urlencode(params)}"
        return Response({"authorization_url": url})


class TwitterAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get("code")
        code_verifier = request.session.get("twitter_code_verifier")
        if not code or not code_verifier:
            return HttpResponseBadRequest("Missing code or verifier.")
        data = {
            "grant_type": "authorization_code",
            "client_id": TWITTER_CLIENT_ID,
            "redirect_uri": TWITTER_CALLBACK_URL,
            "code": code,
            "code_verifier": code_verifier,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(TOKEN_URL, data=data, headers=headers, auth=(
            TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET))
        if response.status_code != 200:
            return HttpResponse(f"Token exchange failed: {response.text}", status=400)
        token_data = response.json()
        # You may want to identify the user by session or state param
        user = request.user if request.user.is_authenticated else None
        if not user:
            return HttpResponse("User not authenticated.", status=401)
        TwitterOAuth2Token.objects.update_or_create(
            user=user,
            defaults={
                "access_token": token_data["access_token"],
                "refresh_token": token_data.get("refresh_token"),
                "expires_in": token_data["expires_in"],
                "scope": token_data["scope"],
                "token_type": token_data["token_type"],
            }
        )
        social_account, _ = SocialAccount.objects.get_or_create(user=user)
        if not social_account.twitter:
            social_account.twitter = True
            social_account.save()
        return HttpResponse("""
            <script>
                alert('Twitter account connected successfully!');
                window.location.href = 'http://localhost:5173/dashboard';
            </script>
        """)


class TwitterStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = TwitterOAuth2Token.objects.get(user=request.user)
        except TwitterOAuth2Token.DoesNotExist:
            return Response({"detail": "Not connected."}, status=400)

        headers = {
            "Authorization": f"Bearer {token.access_token}"
        }

        # 1. Get user info
        user_resp = requests.get(
            "https://api.twitter.com/2/users/me?user.fields=public_metrics,created_at",
            headers=headers
        )
        if user_resp.status_code != 200:
            return Response({"detail": "Failed to fetch Twitter user info."}, status=400)
        user_data = user_resp.json().get("data", {})

        user_id = user_data["id"]
        followers_count = user_data.get(
            "public_metrics", {}).get("followers_count", 0)
        tweets_count = user_data.get(
            "public_metrics", {}).get("tweet_count", 0)
        created_at = user_data.get("created_at", "")

        # 2. Get recent tweets (max 100)
        tweets_resp = requests.get(
            f"https://api.twitter.com/2/users/{user_id}/tweets?max_results=100&tweet.fields=public_metrics,created_at",
            headers=headers
        )
        tweets_data = tweets_resp.json().get(
            "data", []) if tweets_resp.status_code == 200 else []

        # 3. Aggregate tweet stats for trends
        # We'll build daily stats for the last 30 days
        from collections import defaultdict

        trends = defaultdict(
            lambda: {"tweets": 0, "views": 0, "likes": 0, "retweets": 0})
        for tweet in tweets_data:
            dt = datetime.strptime(
                tweet["created_at"], "%Y-%m-%dT%H:%M:%S.%fZ").date()
            metrics = tweet.get("public_metrics", {})
            trends[dt]["tweets"] += 1
            # Only available for some accounts
            trends[dt]["views"] += metrics.get("impression_count", 0)
            trends[dt]["likes"] += metrics.get("like_count", 0)
            trends[dt]["retweets"] += metrics.get("retweet_count", 0)

        # Prepare trends for charting
        # trend_list = []

        # for date in sorted(trends.keys()):
        #     trend_list.append({
        #         "date": date.isoformat(),
        #         "tweets": trends[date]["tweets"],
        #         "views": trends[date]["views"],
        #         "likes": trends[date]["likes"],
        #         "retweets": trends[date]["retweets"],
        #     })

        # 4. Prepare response
        # ...existing code...

        # Simulate 7 days of trends for demo

        trend_list = []
        today = datetime.utcnow().date()
        for i in range(7):
            date = today - timedelta(days=6 - i)
            trend_list.append({
                "date": date.isoformat(),
                "tweets": 2 + i,
                "views": 100 + i * 20,
                "likes": 5 + i * 3,
                "retweets": 1 + i % 2,
            })

        return Response({
            "profile": {
                "username": user_data.get("username", "demo_user"),
                "followers_count": followers_count,
                "tweets_count": tweets_count,
                "created_at": created_at,
            },
            "tweets": [
                {
                    "id": "1",
                    "text": "Hello Twitter!",
                    "created_at": "2024-06-01T10:00:00Z",
                    "public_metrics": {"like_count": 10, "retweet_count": 2}
                },
                {
                    "id": "2",
                    "text": "Another tweet!",
                    "created_at": "2024-06-02T11:00:00Z",
                    "public_metrics": {"like_count": 8, "retweet_count": 1}
                }
            ],
            "trends": trend_list,
        })


class TwitterDisconnectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        TwitterOAuth2Token.objects.filter(user=request.user).delete()
        social_account, _ = SocialAccount.objects.get_or_create(
            user=request.user)
        social_account.twitter = False
        social_account.save()
        return Response({"detail": "Twitter account disconnected."})
