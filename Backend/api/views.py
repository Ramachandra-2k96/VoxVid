from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import logging
from django.conf import settings
import base64
from django.core.files.uploadedfile import InMemoryUploadedFile
from .serializers import RegisterSerializer, UserSerializer, VideoGenerationSerializer, ProfileSerializer
from .models import VideoGeneration, Profile
from agno.agent import Agent
from agno.models.cerebras import CerebrasOpenAI
from backend.settings import CEREBRUS_API_KEY
import os
import tempfile
from api.gcp_storage import (
    ensure_bucket_exists,
    upload_file_object_to_gcp,
    download_and_upload_to_gcp,
    generate_unique_blob_name
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    return Response({"user": user_data, "tokens": tokens}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    # Accept either username or email
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if username is None or password is None:
        return Response({"detail": "Must include username/email and password"}, status=status.HTTP_400_BAD_REQUEST)

    # Try authenticate; if email provided, try to fetch username
    user = authenticate(request, username=username, password=password)
    if user is None:
        # Authentication failed; try by email lookup
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            u = User.objects.get(email=username)
            user = authenticate(request, username=u.username, password=password)
        except User.DoesNotExist:
            user = None

    if user is None:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    return Response({"user": user_data, "tokens": tokens})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
    except Exception as e:
        # Even if token blacklisting fails, return success for client-side logout
        return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_video_generation(request):
    name = request.data.get('name')
    script_input = request.data.get('script_input')
    voice_provider = request.data.get('voice_provider')  # e.g., 'microsoft', 'elevenlabs'
    voice_id = request.data.get('voice_id')  # e.g., 'en-US-JennyNeural'
    voice_language = request.data.get('voice_language')  # e.g., 'English (United States)'

    # Accept either an uploaded file (multipart/form-data) as 'image_file'
    # or a direct source_url (for backward compatibility)
    uploaded_file = request.FILES.get('image_file') if hasattr(request, 'FILES') else None
    source_url = request.data.get('source_url') if not uploaded_file else None

    if not all([name, script_input]) or (not source_url and not uploaded_file):
        return Response({"detail": "name, image_file or source_url, and script_input are required"}, status=status.HTTP_400_BAD_REQUEST)

    did_api_key = getattr(settings, 'DDI_API_KEY', None)
    if not did_api_key:
        logging.error('DDI_API_KEY not set in settings')
        return Response({"detail": "D-ID API key not configured on server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Ensure GCP bucket exists
    try:
        ensure_bucket_exists()
    except Exception as e:
        logging.error(f'Failed to ensure GCP bucket exists: {e}')
        return Response({"detail": "Failed to initialize GCP storage"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # If an image file was uploaded, upload it to GCP first
    gcp_image_url = None
    if uploaded_file and isinstance(uploaded_file, InMemoryUploadedFile):
        try:
            # Generate unique blob name for the image
            blob_name = generate_unique_blob_name('images', uploaded_file.name)
            
            # Upload to GCP and get public URL
            gcp_image_url = upload_file_object_to_gcp(uploaded_file, blob_name)
            
            # Use GCP URL as source_url for D-ID
            source_url = gcp_image_url
            
        except Exception as e:
            logging.exception('Error uploading image to GCP: %s', e)
            return Response({"detail": "Failed to upload image to GCP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print(script_input)
    agent = Agent(
        model=CerebrasOpenAI(id="gpt-oss-120b", api_key=CEREBRUS_API_KEY),
        markdown=False,
        instructions = """
                You are a **Famous Script Agent and Transcriptionist**.

                Your only task is to **process and enhance user-provided scripts** by:

                * Checking if the script language matches the provided `language` input.
                * If the script and language **match**:

                * Return the **exact same script** as output (no edits, no notes).
                * If the script and language do **not** match:

                * Rewrite the entire script in the specified language.
                * Ensure it reads natively and naturally in that language.
                * Preserve the same meaning, tone, and emotional intent.
                * Improve phrasing slightly for authenticity and fluency.

                Formatting rules:

                * Maintain the original format, scene order, and character names.
                * Output **only** the final script (no introductions, explanations, or comments).
                * Do **not** add any meta text like “Here’s your translation” or “Improved version”.

                Your goal is to deliver a script that reads as if it were written and localized by a native professional screenwriter and transcriptionist.
                """
            )
    run_response = agent.run(" Script: "+ script_input+"\n Language: "+ voice_language, user_id=str(request.user.id))
    print(run_response.content)
    enhanced_script = run_response.content

    # Call D-ID talks API
    # Build the request payload
    talk_payload = {
        'source_url': source_url,
        'script': {
            'type': 'text',
            'input': enhanced_script,
        },
        "config": {
            "driver_url": "bank://lively/",
            "motion_factor": 1.0,
        }
    }
    print(talk_payload)
    if voice_provider and voice_id:
        # Keep backward compatibility: voice_provider might be something like 'amazon' or a dict
        provider_data = {
            'type': voice_provider,
            'voice_id': voice_id
        }
        if voice_language:
            provider_data['language'] = voice_language
        talk_payload['script']['provider'] = provider_data

    response = requests.post(
        'https://api.d-id.com/talks',
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Basic {did_api_key}',
        },
        json=talk_payload
    )

    if not response.ok:
        return Response({"detail": "Failed to start video generation"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data = response.json()
    talk_id = data.get('id')
    if not talk_id:
        return Response({"detail": "No talk ID from D-ID"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Save to DB with GCP image URL
    video_gen = VideoGeneration.objects.create(
        user=request.user,
        name=name,
        source_url=gcp_image_url or source_url,  # Store GCP URL
        script_input=script_input,
        talk_id=talk_id,
        status='created',
        voice_provider=voice_provider,
        voice_id=voice_id,
        config={'fluent': False, 'pad_audio': 0.0},
    )

    serializer = VideoGenerationSerializer(video_gen)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
    return


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_video_generations(request):
    videos = VideoGeneration.objects.filter(user=request.user).order_by('-created_at')
    serializer = VideoGenerationSerializer(videos, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_video_generation(request, pk):
    try:
        video = VideoGeneration.objects.get(pk=pk, user=request.user)
    except VideoGeneration.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = VideoGenerationSerializer(video)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_video_status(request, pk):
    try:
        video = VideoGeneration.objects.get(pk=pk, user=request.user)
    except VideoGeneration.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    # Fetch status from D-ID
    did_api_key = getattr(settings, 'DDI_API_KEY', None)
    if not did_api_key:
        logging.error('DDI_API_KEY not set in settings')
        return Response({"detail": "D-ID API key not configured on server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = requests.get(
        f'https://api.d-id.com/talks/{video.talk_id}',
        headers={
            'Accept': 'application/json',
            'Authorization': f'Basic {did_api_key}',
        }
    )

    if response.ok:
        data = response.json()
        video.status = data.get('status', video.status)
        
        # If video generation is done and result_url is available, upload to GCP
        if 'result_url' in data and data['result_url']:
            did_video_url = data['result_url']
            
            # Check if we already have a GCP URL (avoid re-uploading)
            if not video.result_url or not video.result_url.startswith('https://storage.googleapis.com/'):
                try:
                    # Generate unique blob name for the video
                    blob_name = generate_unique_blob_name('videos', f"{video.name}_{video.talk_id}.mp4")
                    
                    # Download from D-ID and upload to GCP
                    gcp_video_url = download_and_upload_to_gcp(did_video_url, blob_name)
                    
                    # Store GCP URL instead of D-ID URL
                    video.result_url = gcp_video_url
                except Exception as e:
                    logging.exception('Error uploading video to GCP: %s', e)
                    # Fallback to D-ID URL if GCP upload fails
                    video.result_url = did_video_url
            
        if 'audio_url' in data:
            video.audio_url = data['audio_url']
        if 'metadata' in data:
            video.metadata = data['metadata']
        video.save()

    serializer = VideoGenerationSerializer(video)
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_detail(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = ProfileSerializer(profile, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_enhance_script(request):
    script = request.data.get('script', '')
    if not script:
        return Response({"detail": "Script is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    agent = Agent(
        model=CerebrasOpenAI(id="gpt-oss-120b", api_key=CEREBRUS_API_KEY),
        markdown=False,
        instructions = """
            You are a professional **Script Enhancer**.
            Your only task is to **improve user-provided scripts** by:

            * Correcting all grammar, spelling, and punctuation errors.
            * Enhancing dialogue for clarity, tone, and natural flow.
            * Preserving the original meaning, structure, and intent.
            * Elevating language quality while keeping it natural and engaging.
            * Maintaining the original format, scene order, and character names.

            When responding:

            * Output **only** the enhanced version of the script.
            * Do **not** add introductions, explanations, notes, or comments.
            * Do **not** say things like “Here’s the improved script.”
            * Simply return the improved script text as the entire reply.

            Your goal is to make the script read as if it was polished by a professional screenwriter or dialogue editor.

            """
            )
    
    message = script
    if not message:
        return Response({'error': 'message required'}, status=status.HTTP_400_BAD_REQUEST)

    # Use consistent user_id
    run_response = agent.run(message, user_id=str(request.user.id))
    print(run_response.content)
    return Response({"enhanced_script": run_response.content})
