import os
import secrets
import base64
import hashlib
from urllib.parse import urlencode
from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse
import requests

# Twitter OAuth2 endpoints
AUTHORIZATION_URL = "https://twitter.com/i/oauth2/authorize"
TOKEN_URL = "https://api.twitter.com/2/oauth2/token"


def generate_code_verifier():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')


def generate_code_challenge(verifier):
    digest = hashlib.sha256(verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('utf-8')


def twitter_login(request):
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    request.session['code_verifier'] = code_verifier

    params = {
        "response_type": "code",
        "client_id": settings.TWITTER_CLIENT_ID,
        "redirect_uri": settings.TWITTER_CALLBACK_URI,
        "scope": "tweet.read tweet.write users.read offline.access",  # Add scopes as needed
        "state": secrets.token_urlsafe(16),
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
    }
    url = f"{AUTHORIZATION_URL}?{urlencode(params)}"
    return redirect(url)


def twitter_callback(request):
    code = request.GET.get('code')
    code_verifier = request.session.get('code_verifier')
    if not code or not code_verifier:
        return JsonResponse({"error": "Missing code or verifier"}, status=400)

    data = {
        "grant_type": "authorization_code",
        "client_id": settings.TWITTER_CLIENT_ID,
        "redirect_uri": settings.TWITTER_CALLBACK_URI,
        "code": code,
        "code_verifier": code_verifier,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(TOKEN_URL, data=data, headers=headers, auth=(
        settings.TWITTER_CLIENT_ID, settings.TWITTER_CLIENT_SECRET))
    if response.status_code != 200:
        return JsonResponse({"error": response.json()}, status=response.status_code)
    return JsonResponse(response.json())
