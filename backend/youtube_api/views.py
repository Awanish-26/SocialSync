# youtube_integration/views.py
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from googleapiclient.discovery import build
from rest_framework.permissions import AllowAny, IsAuthenticated
from google_auth_oauthlib.flow import Flow
import jwt

from .models import YouTubeCredentials

User = get_user_model()


class YouTubeAuthInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        state = jwt.encode({'user_id': request.user.id},
                           settings.SECRET_KEY, algorithm='HS256')
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                }
            },
            scopes=settings.GOOGLE_OAUTH2_SCOPES,
            redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI
        )

        authorization_url, _ = flow.authorization_url(
            access_type='offline',  # Important for getting a refresh token
            include_granted_scopes='true',
            state=state,  # Pass the state for CSRF protection
            prompt='consent',
        )
        # Store state in session to verify it in the callback if needed for CSRF protection
        request.session['oauth_state'] = state
        return Response({'authorization_url': authorization_url})


class YouTubeAuthCallbackView(APIView):
    # Google redirects here, user might not have a session yet
    permission_classes = [AllowAny]

    def get(self, request):
        state = request.GET.get('state')
        try:
            payload = jwt.decode(
                state, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.objects.get(id=user_id)
        except Exception:
            return Response({'error': 'Invalid or missing state parameter.'}, status=400)
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=settings.GOOGLE_OAUTH2_SCOPES,
            redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI,
        )

        try:
            flow.fetch_token(
                authorization_response=request.build_absolute_uri())
        except Exception as e:
            # Handle exceptions like MismatchingStateError, etc.
            return Response({'error': 'Failed to fetch token: ' + str(e)}, status=400)

        credentials = flow.credentials

        # Store the credentials
        user_creds, created = YouTubeCredentials.objects.update_or_create(
            user=user,
            defaults={
                'access_token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_expiry': credentials.expiry,
                'scopes': " ".join(credentials.scopes) if credentials.scopes else "",
            }
        )
        if not user_creds.refresh_token and credentials.refresh_token:
            user_creds.refresh_token = credentials.refresh_token
            user_creds.save()

        # Redirect to a success page on your Vite frontend
        # Pass a query param to indicate success
        frontend_success_url = 'http://localhost:5173/dashboard'
        return redirect(frontend_success_url)


class YouTubeStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            creds = YouTubeCredentials.objects.get(user=request.user)
        except YouTubeCredentials.DoesNotExist:
            return Response({'error': 'YouTube not connected'}, status=400)

        # Build credentials object for googleapiclient
        from google.oauth2.credentials import Credentials
        credentials = Credentials(
            creds.access_token,
            refresh_token=creds.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_OAUTH2_CLIENT_ID,
            client_secret=settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            scopes=creds.scopes.split()
        )

        youtube = build('youtube', 'v3', credentials=credentials)

        # Get channel statistics
        channels_response = youtube.channels().list(
            part="snippet,statistics,contentDetails",
            mine=True
        ).execute()

        channel = channels_response["items"][0]
        stats = channel["statistics"]
        snippet = channel["snippet"]

        # Example: Get video analytics (last 5 videos)
        uploads_playlist_id = channel["contentDetails"]["relatedPlaylists"]["uploads"]
        playlist_response = youtube.playlistItems().list(
            part="snippet,contentDetails",
            playlistId=uploads_playlist_id,
            maxResults=5
        ).execute()

        video_ids = [item["contentDetails"]["videoId"]
                     for item in playlist_response["items"]]
        videos_response = youtube.videos().list(
            part="snippet,statistics",
            id=",".join(video_ids)
        ).execute()

        videos = [{
            "title": v["snippet"]["title"],
            "views": v["statistics"].get("viewCount"),
            "likes": v["statistics"].get("likeCount"),
            "comments": v["statistics"].get("commentCount"),
        } for v in videos_response["items"]]

        return Response({
            "channel": {
                "title": snippet["title"],
                "subscribers": stats.get("subscriberCount"),
                "views": stats.get("viewCount"),
                "videoCount": stats.get("videoCount"),
                "description": snippet.get("description"),
            },
            "videos": videos
        })


class YouTubeDisconnectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            creds = YouTubeCredentials.objects.get(user=request.user)
            creds.delete()
            return Response({'message': 'YouTube account disconnected.'}, status=status.HTTP_200_OK)
        except YouTubeCredentials.DoesNotExist:
            return Response({'error': 'No YouTube account connected.'}, status=status.HTTP_400_BAD_REQUEST)
