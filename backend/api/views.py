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


class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username, email=email, password=password)
        user.save()

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data.get('username'))
            response.data['name'] = user.username
        return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def connect_youtube(request):
    channel_id = request.data.get("channel_id")
    api_key = settings.YOUTUBE_API_KEY

    url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={channel_id}&key={api_key}"
    res = requests.get(url)

    if res.status_code != 200:
        return Response({"error": "Failed to fetch channel data"}, status=400)

    data = res.json().get("items", [])[0]
    snippet = data["snippet"]
    stats = data["statistics"]

    # Create or update SocialAccount
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_youtube_stats(request):
    try:
        account = SocialAccount.objects.get(
            user=request.user, platform="youtube")
        channel_id = account.channel_id
        api_key = settings.YOUTUBE_API_KEY
        url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={channel_id}&key={api_key}"
        res = requests.get(url).json()

        stats = res["items"][0]["statistics"]

        YouTubeStats.objects.create(
            social_account=account,
            subscriber_count=int(stats["subscriberCount"]),
            view_count=int(stats["viewCount"]),
            video_count=int(stats["videoCount"]),
            recorded_at=timezone.now()
        )

        return Response({"message": "Stats refreshed successfully!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_youtube_stats(request):
    account = SocialAccount.objects.get(user=request.user, platform="youtube")
    stats = YouTubeStats.objects.filter(
        social_account=account).order_by("recorded_at")

    data = [
        {
            "recorded_at": stat.recorded_at.strftime("%Y-%m-%d"),
            "subscriber_count": stat.subscriber_count,
            "view_count": stat.view_count,
            "video_count": stat.video_count,
        }
        for stat in stats
    ]
    return Response(data)


# Delete the YouTube account
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
