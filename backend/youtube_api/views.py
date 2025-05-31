# youtube_integration/views.py
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import datetime
from django.utils import timezone

from .models import YouTubeCredentials

User = get_user_model()


class YouTubeAuthInitiateView(APIView):
    # Or AllowAny if users can initiate before logging into your app
    permission_classes = [IsAuthenticated]

    def get(self, request):
        flow = Flow.from_client_secrets_file(
            None,  # We will pass client_config directly
            scopes=settings.GOOGLE_OAUTH2_SCOPES,
            redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI
        )
        # Instead of client_secrets.json, provide config directly
        flow.client_config = {
            "web": {
                "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            }
        }

        authorization_url, state = flow.authorization_url(
            access_type='offline',  # Important for getting a refresh token
            include_granted_scopes='true'
        )
        # Store state in session to verify it in the callback if needed for CSRF protection
        request.session['oauth_state'] = state
        return Response({'authorization_url': authorization_url})


class YouTubeAuthCallbackView(APIView):
    # Google redirects here, user might not have a session yet
    permission_classes = [AllowAny]

    def get(self, request):
        state = request.GET.get('state')
        # Optional: Verify state matches request.session.get('oauth_state') for security

        flow = Flow.from_client_secrets_file(
            None,
            scopes=settings.GOOGLE_OAUTH2_SCOPES,
            redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI,
            # state=state # Pass state back if you used it
        )
        flow.client_config = {
            "web": {
                "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        }

        try:
            flow.fetch_token(
                authorization_response=request.build_absolute_uri())
        except Exception as e:
            # Handle exceptions like MismatchingStateError, etc.
            return Response({'error': 'Failed to fetch token: ' + str(e)}, status=400)

        credentials = flow.credentials

        # Ensure the user is logged into your Django app
        # This part depends on how you manage users.
        # If the user isn't logged in, you might redirect them to your app's login page first,
        # or handle user association differently. For simplicity, assuming the user is logged in:
        if not request.user.is_authenticated:
            # Handle case where user is not logged in.
            # You might redirect to a page on your frontend to log in/register
            # and then re-initiate or store the token temporarily.
            # For now, returning an error.
            return Response({'error': 'User not authenticated in Django app. Please log in.'}, status=401)

        # Store the credentials
        user_creds, created = YouTubeCredentials.objects.update_or_create(
            user=request.user,
            defaults={
                'access_token': credentials.token,
                # This might be None if already granted offline access
                'refresh_token': credentials.refresh_token,
                'token_expiry': credentials.expiry,
                'scopes': " ".join(credentials.scopes) if credentials.scopes else "",
            }
        )
        if not user_creds.refresh_token and credentials.refresh_token:
            user_creds.refresh_token = credentials.refresh_token
            user_creds.save()

        # Redirect to a success page on your Vite frontend
        # Or your production URL
        frontend_success_url = 'http://localhost:5173/youtube-auth-success'
        return redirect(frontend_success_url)


class YouTubeChannelInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get_youtube_service(self, user):
        try:
            creds_model = YouTubeCredentials.objects.get(user=user)
        except YouTubeCredentials.DoesNotExist:
            raise HttpError(
                "User has not authenticated with YouTube.", status_code=401)

        credentials = Credentials(
            token=creds_model.access_token,
            refresh_token=creds_model.refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=settings.GOOGLE_OAUTH2_CLIENT_ID,
            client_secret=settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            scopes=creds_model.scopes.split(
                " ") if creds_model.scopes else settings.GOOGLE_OAUTH2_SCOPES
        )

        if credentials.expired and credentials.refresh_token:
            try:
                # from google.auth.transport.requests import Request
                credentials.refresh(Request())
                # Update stored credentials
                creds_model.access_token = credentials.token
                creds_model.token_expiry = credentials.expiry
                creds_model.save()
            except Exception as e:
                raise HttpError(
                    f"Failed to refresh token: {str(e)}", status_code=401)

        if not credentials.valid:
            # This could happen if refresh also failed or no refresh token
            raise HttpError(
                "Invalid or expired YouTube credentials.", status_code=401)

        return build('youtube', 'v3', credentials=credentials)

    def get(self, request):
        try:
            youtube = self.get_youtube_service(request.user)
            # Example: Get channel info
            response = youtube.channels().list(
                part='snippet,contentDetails,statistics',
                mine=True  # Gets the authenticated user's channel
            ).execute()
            return Response(response)
        except HttpError as e:
            return Response({'error': str(e.resp.reason if hasattr(e, 'resp') else e), 'details': e.content.decode() if hasattr(e, 'content') else str(e)}, status=e.resp.status if hasattr(e, 'resp') else 500)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


# Example: View to post a comment (simplified)
class YouTubePostCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        video_id = request.data.get('video_id')
        comment_text = request.data.get('comment_text')
        # Required for commentThreads.insert
        channel_id = request.data.get('channel_id')

        if not all([video_id, comment_text, channel_id]):
            return Response({'error': 'video_id, channel_id, and comment_text are required.'}, status=400)

        try:
            youtube_service = YouTubeChannelInfoView().get_youtube_service(
                request.user)  # Reuse the service getter
            insert_request = youtube_service.commentThreads().insert(
                part="snippet",
                body={
                    "snippet": {
                        "channelId": channel_id,  # ID of the channel posting the comment
                        "videoId": video_id,     # ID of the video being commented on
                        "topLevelComment": {
                            "snippet": {
                                "textOriginal": comment_text
                            }
                        }
                    }
                }
            )
            response = insert_request.execute()
            return Response(response, status=201)
        except HttpError as e:
            return Response({'error': str(e.resp.reason if hasattr(e, 'resp') else e), 'details': e.content.decode() if hasattr(e, 'content') else str(e)}, status=e.resp.status if hasattr(e, 'resp') else 500)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
