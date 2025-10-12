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
    script_input = request.data.get('script_input')

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

    # If an image file was uploaded, upload it to D-ID images endpoint first
    if uploaded_file and isinstance(uploaded_file, InMemoryUploadedFile):
        try:
            # read bytes and create base64 for storage
            uploaded_file.seek(0)
            file_bytes = uploaded_file.read()
            b64 = base64.b64encode(file_bytes).decode('utf-8')
            # store as data URI using content_type
            data_uri = f"data:{uploaded_file.content_type};base64,{b64}"

            # Upload to D-ID images endpoint
            files = {
                'image': (uploaded_file.name, file_bytes, uploaded_file.content_type)
            }
            img_resp = requests.post(
                'https://api.d-id.com/images',
                headers={
                    'Authorization': f'Basic {did_api_key}',
                },
                files=files,
            )
            if not img_resp.ok:
                logging.error('D-ID image upload failed: %s', img_resp.text)
                return Response({"detail": "Failed to upload image to D-ID"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            img_data = img_resp.json()
            # D-ID may return keys like 'url' and 'id'
            image_s3_url = img_data.get('url') or img_data.get('image_url') or img_data.get('s3_url')
            image_id = img_data.get('id') or img_data.get('image_id')

            # Use the returned s3 url as source_url for talks API
            if not image_s3_url:
                logging.error('D-ID image upload did not return a URL: %s', img_data)
                return Response({"detail": "D-ID image upload returned no URL"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            source_url = image_s3_url
        except Exception as e:
            logging.exception('Error handling uploaded image: %s', e)
            return Response({"detail": "Failed to process uploaded image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Call D-ID talks API
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
        config={'fluent': False, 'pad_audio': 0.0},
        original_image_base64=(data_uri if 'data_uri' in locals() else None),
        image_id=(image_id if 'image_id' in locals() else None),
        image_s3_url=(image_s3_url if 'image_s3_url' in locals() else None),
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
    data = serializer.data

    # If the original base64 preview is missing, attempt to fetch the image from
    # the stored image_s3_url or source_url and attach a data URI so the frontend
    # can display a preview. This is a best-effort fallback for legacy records.
    try:
        if not data.get('original_image_base64'):
            candidate_url = video.image_s3_url or video.source_url
            if candidate_url:
                # If candidate_url is an s3:// URL, try to convert to a public https URL
                if candidate_url.startswith('s3://'):
                    rest = candidate_url[len('s3://'):]
                    # Map to the common S3 public URL pattern as a best-effort
                    candidate_url = f'https://s3.amazonaws.com/{rest}'

                if candidate_url.startswith('http'):
                    resp = requests.get(candidate_url, timeout=6)
                    if resp.ok and resp.content:
                        content_type = resp.headers.get('Content-Type', 'image/jpeg')
                        b64 = base64.b64encode(resp.content).decode('utf-8')
                        data_uri = f'data:{content_type};base64,{b64}'
                        data['original_image_base64'] = data_uri
    except Exception as e:
        logging.exception('Failed to fetch remote image for preview: %s', e)

    return Response(data)


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
