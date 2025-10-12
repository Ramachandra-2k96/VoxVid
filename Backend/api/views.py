from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import os
import logging
from .serializers import RegisterSerializer, UserSerializer, VideoGenerationSerializer
from .models import VideoGeneration

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
def create_video_generation(request):
    name = request.data.get('name')
    source_url = request.data.get('source_url')
    script_input = request.data.get('script_input')

    if not all([name, source_url, script_input]):
        return Response({"detail": "name, source_url, and script_input are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Call D-ID API
    did_api_key = os.environ.get('DDI_API_KEY')
    if not did_api_key:
        logging.error('DDI_API_KEY not set in environment')
        return Response({"detail": "D-ID API key not configured on server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = requests.post(
        'https://api.d-id.com/talks',
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Basic {did_api_key}',
        },
        json={
            'source_url': source_url,
            'script': {
                'type': 'text',
                'input': script_input,
            },
            'config': {
                'fluent': 'false',
                'pad_audio': '0.0',
            },
        }
    )

    if not response.ok:
        return Response({"detail": "Failed to start video generation"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data = response.json()
    talk_id = data.get('id')
    if not talk_id:
        return Response({"detail": "No talk ID from D-ID"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Save to DB
    video_gen = VideoGeneration.objects.create(
        user=request.user,
        name=name,
        source_url=source_url,
        script_input=script_input,
        talk_id=talk_id,
        status='created',
        config={'fluent': False, 'pad_audio': 0.0}
    )

    serializer = VideoGenerationSerializer(video_gen)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


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
    did_api_key = os.environ.get('DDI_API_KEY')
    if not did_api_key:
        logging.error('DDI_API_KEY not set in environment')
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
        if 'result_url' in data:
            video.result_url = data['result_url']
        if 'audio_url' in data:
            video.audio_url = data['audio_url']
        if 'metadata' in data:
            video.metadata = data['metadata']
        video.save()

    serializer = VideoGenerationSerializer(video)
    return Response(serializer.data)




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
