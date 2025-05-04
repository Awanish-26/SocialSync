import instaloader
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SocialAccount, YouTubeStats
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from .models import InstagramCredential, InstagramStats
import tweepy
from .models import TwitterCredential, TwitterStats


# User signup view
class SignupView(APIView):
    def post(self, request):
        # Extract user details from request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        # Create new user
        user = User.objects.create_user(
            username=username, email=email, password=password)
        user.save()

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


# Custom JWT token view to include username in response
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data.get('username'))
            response.data['name'] = user.username
        return response


# Connect YouTube account and fetch initial stats
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def connect_youtube(request):
    channel_id = request.data.get("channel_id")
    api_key = settings.YOUTUBE_API_KEY

    # Fetch channel data from YouTube API
    url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={channel_id}&key={api_key}"
    res = requests.get(url)

    if res.status_code != 200:
        return Response({"error": "Failed to fetch channel data"}, status=400)

    data = res.json().get("items", [])[0]
    snippet = data["snippet"]
    stats = data["statistics"]

    # Create or update SocialAccount and YouTubeStats
    social_account, created = SocialAccount.objects.update_or_create(
        user=request.user,
        platform="youtube",
        defaults={
            "connected": True,
            "channel_id": channel_id,
        }
    )

    YouTubeStats.objects.update_or_create(
        social_account=social_account,
        defaults={
            "title": snippet["title"],
            "subscriber_count": stats["subscriberCount"],
            "view_count": stats["viewCount"],
            "video_count": stats["videoCount"],
        }
    )

    return Response({"message": "YouTube connected successfully"})


# Get YouTube connection status and latest stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_youtube_status(request):
    try:
        account = SocialAccount.objects.get(
            user=request.user, platform='youtube')
        if not account.connected:
            return Response({"connected": False})

        stats = YouTubeStats.objects.filter(
            social_account=account).order_by('-recorded_at').first()

        if not stats:
            return Response({"connected": False, "message": "No stats available"})
        return Response({
            "connected": True,
            "title": stats.title,
            "subscriber_count": stats.subscriber_count,
            "view_count": stats.view_count,
            "video_count": stats.video_count,
            "last_updated": stats.recorded_at
        })
    except SocialAccount.DoesNotExist:
        return Response({"connected": False})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# Refresh YouTube stats
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_youtube_stats(request):
    try:
        account = SocialAccount.objects.get(
            user=request.user, platform="youtube")
        channel_id = account.channel_id
        api_key = settings.YOUTUBE_API_KEY

        # Fetch updated stats from YouTube API
        url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={channel_id}&key={api_key}"
        res = requests.get(url).json()

        stats = res["items"][0]["statistics"]

        # Save new stats
        YouTubeStats.objects.create(
            title=YouTubeStats.objects.get(
                social_account=account).title,  # Keep the same title
            social_account=account,
            subscriber_count=int(stats["subscriberCount"]),
            view_count=int(stats["viewCount"]),
            video_count=int(stats["videoCount"]),
            recorded_at=timezone.now()
        )

        return Response({"message": "Stats refreshed successfully!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# Get historical YouTube stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_youtube_stats(request):
    account = SocialAccount.objects.get(user=request.user, platform="youtube")
    stats = YouTubeStats.objects.filter(
        social_account=account).order_by("recorded_at")

    # Format stats for response
    data = [
        {
            "title": stat.title,
            "recorded_at": stat.recorded_at.strftime("%Y-%m-%d"),
            "subscriber_count": stat.subscriber_count,
            "view_count": stat.view_count,
            "video_count": stat.video_count,
        }
        for stat in stats
    ]
    return Response(data)


# Disconnect YouTube account
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disconnect_youtube(request):
    try:
        account = SocialAccount.objects.get(
            user=request.user, platform="youtube")
        account.delete()  # Delete the YouTube account record
        return Response({"message": "YouTube account disconnected successfully."})
    except SocialAccount.DoesNotExist:
        return Response({"error": "YouTube account not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# Instagram functionality

# Check Instagram connection status
class InstagramStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            creds = InstagramCredential.objects.get(user=request.user)
            return Response({
                "connected": True,
                "username": creds.instagram_username
            })
        except InstagramCredential.DoesNotExist:
            return Response({
                "connected": False
            })


# Fetch Instagram engagement stats
@api_view(['POST'])
def fetch_instagram_engagement(request):
    username = request.data.get('username')
    if not username:
        return Response({"error": "No username provided"}, status=400)

    try:
        L = instaloader.Instaloader()
        profile = instaloader.Profile.from_username(L.context, username)

        total_likes = 0
        total_comments = 0
        post_count = 0

        # Fetch stats for the latest 20 posts
        for post in profile.get_posts():
            total_likes += post.likes
            total_comments += post.comments
            post_count += 1
            if post_count >= 20:
                break

        return Response({
            "username": username,
            "total_posts_checked": post_count,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "average_likes": round(total_likes / post_count, 2) if post_count else 0,
            "average_comments": round(total_comments / post_count, 2) if post_count else 0,
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Login and connect Instagram account
class InstagramLoginView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Save or update credentials
        creds, created = InstagramCredential.objects.update_or_create(
            user=request.user,
            defaults={"instagram_username": username,
                      "instagram_password": password}
        )

        # Login to Instagram using Instaloader
        L = instaloader.Instaloader()
        try:
            L.login(username, password)
            profile = instaloader.Profile.from_username(L.context, username)

            # Gather stats for the latest 20 posts
            total_likes = 0
            total_comments = 0
            total_posts = 0

            for post in profile.get_posts():
                total_likes += post.likes
                total_comments += post.comments
                total_posts += 1
                if total_posts >= 20:
                    break

            avg_likes = total_likes / total_posts if total_posts else 0
            avg_comments = total_comments / total_posts if total_posts else 0

            InstagramStats.objects.create(
                user=request.user,
                total_likes=total_likes,
                total_comments=total_comments,
                total_posts_checked=total_posts,
                avg_likes=avg_likes,
                avg_comments=avg_comments,
            )

            return Response({"success": True, "message": "Stats saved successfully."})
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=400)


# Connect Instagram account
class ConnectInstagramView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Both fields are required."}, status=400)

        obj, created = InstagramCredential.objects.update_or_create(
            user=request.user,
            defaults={"instagram_username": username,
                      "instagram_password": password}
        )
        return Response({"message": "Instagram account connected."})


# Get Instagram stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_instagram_stats(request):
    try:
        stats = InstagramStats.objects.filter(user=request.user).last()
        if not stats:
            return Response({"error": "No stats found."}, status=404)

        return Response({
            "total_likes": stats.total_likes,
            "total_comments": stats.total_comments,
            "total_posts_checked": stats.total_posts_checked,
            "avg_likes": stats.avg_likes,
            "avg_comments": stats.avg_comments,
            "timestamp": stats.created_at  # assuming auto_now_add=True
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Refresh Instagram stats
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_instagram_stats(request):
    try:
        creds = InstagramCredential.objects.get(user=request.user)
        L = instaloader.Instaloader()
        L.login(creds.instagram_username, creds.instagram_password)
        profile = instaloader.Profile.from_username(
            L.context, creds.instagram_username)

        total_likes = 0
        total_comments = 0
        post_count = 0

        # Fetch stats for the latest 20 posts
        for post in profile.get_posts():
            total_likes += post.likes
            total_comments += post.comments
            post_count += 1
            if post_count >= 20:
                break

        avg_likes = total_likes / post_count if post_count else 0
        avg_comments = total_comments / post_count if post_count else 0

        InstagramStats.objects.create(
            user=request.user,
            total_likes=total_likes,
            total_comments=total_comments,
            total_posts_checked=post_count,
            avg_likes=avg_likes,
            avg_comments=avg_comments,
        )

        return Response({"message": "Stats refreshed successfully."})

    except InstagramCredential.DoesNotExist:
        return Response({"error": "Instagram not connected."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Disconnect Instagram account
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def disconnect_instagram(request):
    try:
        InstagramCredential.objects.get(user=request.user).delete()
        return Response({"message": "Instagram disconnected."})
    except InstagramCredential.DoesNotExist:
        return Response({"error": "Instagram not connected."}, status=404)


# Connect Twitter account
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def connect_twitter(request):
    api_key = settings.TWITTER_API_KEY
    api_secret = settings.***REMOVED***
    access_token = request.data.get("access_token")
    access_token_secret = request.data.get("access_token_secret")

    if not access_token or not access_token_secret:
        return Response({"error": "Access tokens are required."}, status=400)

    try:
        # Authenticate with Twitter API
        auth = tweepy.OAuth1UserHandler(
            api_key, api_secret, access_token, access_token_secret)
        api = tweepy.API(auth)
        user = api.verify_credentials()

        # Save Twitter credentials
        TwitterCredential.objects.update_or_create(
            user=request.user,
            defaults={
                "access_token": access_token,
                "access_token_secret": access_token_secret,
                "twitter_username": user.screen_name,
            },
        )

        # Fetch and store initial stats
        TwitterStats.objects.create(
            user=request.user,
            followers_count=user.followers_count,
            tweets_count=user.statuses_count,
            likes_count=user.favourites_count,
        )

        return Response({"message": "Twitter account connected and stats saved successfully."})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Disconnect Twitter account
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def disconnect_twitter(request):
    try:
        TwitterCredential.objects.get(user=request.user).delete()
        return Response({"message": "Twitter disconnected."})
    except TwitterCredential.DoesNotExist:
        return Response({"error": "Twitter not connected."}, status=404)


# Get Twitter stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_twitter_stats(request):
    try:
        stats = TwitterStats.objects.filter(
            user=request.user).order_by('recorded_at')
        if not stats:
            return Response({"error": "No stats found."}, status=404)
        data = [
            {
                "title": stats.user.twittercredential.twitter_username,
                "followers_count": stats.followers_count,
                "tweets_count": stats.tweets_count,
                "likes_count": stats.likes_count,
                "timestamp": stats.recorded_at.strftime("%Y-%m-%d"),
            } for stats in stats
        ]
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Refresh Twitter stats
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_twitter_stats(request):
    try:
        creds = TwitterCredential.objects.get(user=request.user)
        auth = tweepy.OAuth1UserHandler(
            settings.TWITTER_API_KEY,
            settings.***REMOVED***,
            creds.access_token,
            creds.access_token_secret,
        )
        api = tweepy.API(auth)
        user = api.verify_credentials()

        # Save new stats
        TwitterStats.objects.create(
            user=request.user,
            followers_count=user.followers_count,
            tweets_count=user.statuses_count,
            likes_count=user.favourites_count,
        )
        return Response({"message": "Stats refreshed successfully."})
    except TwitterCredential.DoesNotExist:
        return Response({"error": "Twitter not connected."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Get Twitter connection status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_twitter_status(request):
    try:
        creds = TwitterCredential.objects.get(user=request.user)
        return Response({
            "connected": True,
            "username": creds.twitter_username
        })
    except TwitterCredential.DoesNotExist:
        return Response({
            "connected": False
        })
