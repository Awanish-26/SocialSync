from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
import tweepy
from .models import TwitterCredential, TwitterStats, SocialAccount


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


# Get account status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_account_status(request):
    user = request.user
    try:
        account = SocialAccount.objects.get(user=user)
        return Response({
            'youtube': account.youtube,
            'twitter': account.twitter,
            'instagram': account.instagram,
        })
    except SocialAccount.DoesNotExist:
        return Response({
            'youtube': False,
            'twitter': False,
            'instagram': False,
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def connect_twitter(request):
    api_key = settings.TWITTER_API_KEY
    api_secret = settings.TWITTER_API_SECRET
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

        return Response({"message": "Twitter account connected and stats saved successfully."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Get Twitter stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_twitter_status(request):
    try:
        # Check if Twitter account is connected
        try:
            creds = TwitterCredential.objects.get(user=request.user)
        except TwitterCredential.DoesNotExist:
            return Response({"connected": False, "data": []})

        # Fetch Twitter stats
        stats = TwitterStats.objects.filter(
            user=request.user).order_by('recorded_at')
        if not stats:
            return Response({"connected": True, "data": []})

        data = [
            {
                "title": creds.twitter_username,
                "followers_count": stat.followers_count,
                "tweets_count": stat.tweets_count,
                "likes_count": stat.likes_count,
                "timestamp": stat.recorded_at.strftime("%Y-%m-%d"),
            } for stat in stats
        ]
        return Response({"connected": True, "data": data})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_twitter_stats(request):
    try:
        creds = TwitterCredential.objects.get(user=request.user)
        auth = tweepy.OAuth1UserHandler(
            settings.TWITTER_API_KEY,
            settings.TWITTER_API_SECRET,
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


# Disconnect Twitter account
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def disconnect_twitter(request):
    try:
        TwitterCredential.objects.get(user=request.user).delete()
        return Response({"message": "Twitter disconnected."})
    except TwitterCredential.DoesNotExist:
        return Response({"error": "Twitter not connected."}, status=404)
