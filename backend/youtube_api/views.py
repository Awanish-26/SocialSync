from django.shortcuts import redirect, render
from django.urls import reverse
from django.conf import settings
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import googleapiclient.discovery
import os

# Ensure settings are configured
if not hasattr(settings, 'GOOGLE_CLIENT_ID') or not hasattr(settings, 'GOOGLE_CLIENT_SECRET'):
    raise Exception(
        "Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your Django settings.")

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI = getattr(
    settings, 'GOOGLE_REDIRECT_URI', 'http://localhost:8000/oauth/callback/')
# Add other scopes as needed
YOUTUBE_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly',
                  'https://www.googleapis.com/auth/youtube.force-ssl',
                  'https://www.googleapis.com/auth/youtube.upload',
                  ]


def google_login(request):
    flow = Flow.from_client_secrets_file(
        # Update this path
        os.path.join(settings.BASE_DIR, 'path/to/your/client_secret.json'),
        scopes=YOUTUBE_SCOPES,
        redirect_uri=request.build_absolute_uri(reverse('oauth_callback'))
    )
    authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        # A random string, include it in the state parameter of the authorization
        # request and confirm that it matches the state parameter in the
        # authorization response.
        include_granted_scopes='true'
    )
    request.session['oauth_state'] = state
    return redirect(authorization_url)


def google_callback(request):
    state = request.session.get('oauth_state')
    if state is None or request.GET.get('state') != state:
        return render(request, 'oauth_error.html', {'error': 'Invalid state parameter.'})

    flow = Flow.from_client_secrets_file(
        # Update this path
        os.path.join(settings.BASE_DIR, 'path/to/your/client_secret.json'),
        scopes=YOUTUBE_SCOPES,
        redirect_uri=request.build_absolute_uri(reverse('oauth_callback'))
    )

    try:
        flow.fetch_token(code=request.GET.get('code'))
    except Exception as e:
        return render(request, 'oauth_error.html', {'error': f'Failed to fetch token: {e}'})

    credentials = flow.credentials
    # Store the credentials securely in your database associated with the user.
    # You'll likely want to serialize this.
    request.session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

    return redirect('fetch_youtube_data')  # Redirect to a view to fetch data


def fetch_youtube_data(request):
    credentials_data = request.session.get('credentials')
    if not credentials_data:
        return redirect('google_login')

    credentials = Credentials(**credentials_data)
    youtube = googleapiclient.discovery.build(
        'youtube', 'v3', credentials=credentials)

    try:
        # Example: Get the authenticated user's channel
        request_channel = youtube.channels().list(
            part='snippet,statistics',
            mine=True
        )
        response_channel = request_channel.execute()
        channel_data = response_channel.get('items', [])

        # Example: Get the authenticated user's uploads
        request_uploads = youtube.channels().list(
            part='contentDetails',
            mine=True
        )
        response_uploads = request_uploads.execute()
        uploads_playlist_id = response_uploads['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        request_videos = youtube.playlistItems().list(
            part='snippet',
            playlistId=uploads_playlist_id,
            maxResults=10  # Adjust as needed
        )
        response_videos = request_videos.execute()
        video_data = response_videos.get('items', [])

        context = {
            'channel_data': channel_data,
            'video_data': video_data,
        }
        return render(request, 'youtube_data.html', context)

    except Exception as e:
        print(f"An error occurred: {e}")
        return render(request, 'oauth_error.html', {'error': f'Error fetching YouTube data: {e}'})
