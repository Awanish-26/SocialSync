# youtube_integration/views.py
import jwt
import random
import logging
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from googleapiclient.discovery import build
from rest_framework.permissions import AllowAny, IsAuthenticated
from google_auth_oauthlib.flow import Flow
from api.models import SocialAccount
from .models import YouTubeCredentials
from datetime import datetime, timedelta, timezone
from rest_framework_simplejwt.tokens import RefreshToken    # added by Vishal

User = get_user_model()
logger = logging.getLogger(__name__)    # added by Vishal


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
        social_account, _ = SocialAccount.objects.get_or_create(user=user)
        if not social_account.youtube:
            social_account.youtube = True
            social_account.save()
        # Generate JWT tokens for the user (added by Vishal)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        # Redirect to frontend with tokens in query params
        frontend_success_url = f'http://localhost:5173/dashboard?from=youtube&access={access_token}&refresh={refresh_token}'
        return redirect(frontend_success_url)


class YouTubeStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Log the request details (added by Vishal)
        logger.info('[YouTubeStatsView] Request received for YouTube stats.')
        logger.info(f'[YouTubeStatsView] User: {request.user} Authenticated: {request.user.is_authenticated}')
        logger.info(f'[YouTubeStatsView] Authorization header: {request.META.get("HTTP_AUTHORIZATION")}')
        try:
            creds = YouTubeCredentials.objects.get(user=request.user)
            # Log the credentials retrieval (added by Vishal)
            logger.info(f'[YouTubeStatsView] Found YouTube credentials for user {request.user}.')
        except YouTubeCredentials.DoesNotExist:
            # Log the missing credentials (added by Vishal)
            logger.warning(f'[YouTubeStatsView] No YouTube credentials for user {request.user}.')
            return Response({'error': 'YouTube not connected'}, status=400)
        try:
            # Build credentials object for googleapiclient(added by Vishal)
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
            analytics = build('youtubeAnalytics', 'v2', credentials=credentials)

            # Get channel statistics(added by Vishal)
            channels_response = youtube.channels().list(
                part="snippet,statistics,contentDetails",
                mine=True
            ).execute()

            channel = channels_response["items"][0] # added by Vishal
            stats = channel["statistics"]
            snippet = channel["snippet"]

            # Example: Get video analytics (last 5 videos)(added by Vishal)
            uploads_playlist_id = channel["contentDetails"]["relatedPlaylists"]["uploads"]
            playlist_response = youtube.playlistItems().list(
                part="snippet,contentDetails",
                playlistId=uploads_playlist_id,
                maxResults=5
            ).execute()

            video_ids = [item["contentDetails"]["videoId"]  # added by Vishal
                         for item in playlist_response["items"]]
            videos_response = youtube.videos().list(
                part="snippet,statistics",
                id=",".join(video_ids)
            ).execute()

            videos = [{ # added by Vishal
                "title": v["snippet"]["title"],
                "views": v["statistics"].get("viewCount"),
                "likes": v["statistics"].get("likeCount"),
                "comments": v["statistics"].get("commentCount"),
            } for v in videos_response["items"]]

            # --- REAL TRENDS DATA USING YOUTUBE ANALYTICS API ---(added by Vishal)
            today = datetime.now(timezone.utc).date()
            base_subs = int(stats.get("subscriberCount", 0))
            base_views = int(stats.get("viewCount", 0))
            end_date = datetime.now(timezone.utc).date()
            start_date = end_date - timedelta(days=29)

            # Subscribers trend(added by Vishal)
            subs_response = analytics.reports().query(
                ids='channel==MINE',
                startDate=start_date.isoformat(),
                endDate=end_date.isoformat(),
                metrics='subscribersGained',
                dimensions='day'
            ).execute()

            # Views trend(added by Vishal)
            views_response = analytics.reports().query(
                ids='channel==MINE',
                startDate=start_date.isoformat(),
                endDate=end_date.isoformat(),
                metrics='views',
                dimensions='day'
            ).execute()

            # Engagement trend (likes + comments)(added by Vishal)
            engagement_response = analytics.reports().query(
                ids='channel==MINE',
                startDate=start_date.isoformat(),
                endDate=end_date.isoformat(),
                metrics='likes,comments',
                dimensions='day'
            ).execute()
            # Helper to parse rows

            def parse_trend(response, metric_index=1):# added by Vishal
                return [
                    {"date": row[0], "value": int(row[metric_index])}
                    for row in response.get("rows", [])
                ]

            trends = { # added by Vishal
                "subscribers": parse_trend(subs_response),
                "views": parse_trend(views_response),
                "engagement": [
                    {
                        "date": row[0],
                        "value": int(row[1]) + int(row[2])
                    }
                    for row in engagement_response.get("rows", [])
                ],
            }

            for i in range(30): # Simulate 30 days of data (added by Vishal)
                date = today - timedelta(days=29 - i)
                # Simulate daily growth
                subs = base_subs + i * 5
                views = base_views + i * 5
                # Simulate engagement as likes + comments (random for demo)
                engagement = random.randint(10, 100)

                trends["subscribers"].append({ # added by Vishal
                    "date": date.isoformat(),
                    "value": subs
                })
                trends["views"].append({
                    "date": date.isoformat(),
                    "value": views
                })
                trends["engagement"].append({
                    "date": date.isoformat(),
                    "value": engagement
                })

            return Response({ # added by Vishal
                "channel": {
                    "title": snippet["title"],
                    "subscribers": stats.get("subscriberCount"),
                    "views": stats.get("viewCount"),
                    "videoCount": stats.get("videoCount"),
                    "description": snippet.get("description"),
                },
                "videos": videos,
                "trends": trends
            })
        except Exception as e:
            logger.error(f'[YouTubeStatsView] Exception during stats fetch: {e}', exc_info=True)
            return Response({'error': f'Exception: {str(e)}'}, status=500)


class YouTubeDisconnectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            YouTubeCredentials.objects.filter(user=user).delete()
            account = SocialAccount.objects.get(user=user)
            account.youtube = False
            account.save()
            return Response({'message': 'YouTube account disconnected.'}, status=status.HTTP_200_OK)
        except YouTubeCredentials.DoesNotExist:
            return Response({'error': 'No YouTube account connected.'}, status=status.HTTP_400_BAD_REQUEST)
