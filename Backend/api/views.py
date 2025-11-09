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
from pydub import AudioSegment
from django.core.files.base import ContentFile


def convert_audio_to_mp3(audio_file):
    """
    Convert any audio file to MP3 format using pydub.
    Returns a ContentFile object containing the MP3 data.
    """
    try:
        # Create a temporary file to save the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.name)[1]) as temp_input:
            # Write uploaded file to temp location
            for chunk in audio_file.chunks():
                temp_input.write(chunk)
            temp_input_path = temp_input.name
        
        # Load audio using pydub (supports many formats)
        audio = AudioSegment.from_file(temp_input_path)
        
        # Create a temporary file for MP3 output
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_output:
            temp_output_path = temp_output.name
        
        # Export as MP3
        audio.export(temp_output_path, format='mp3', bitrate='192k')
        
        # Read the MP3 file into memory
        with open(temp_output_path, 'rb') as mp3_file:
            mp3_data = mp3_file.read()
        
        # Clean up temporary files
        try:
            os.unlink(temp_input_path)
            os.unlink(temp_output_path)
        except Exception as e:
            logging.warning(f'Failed to clean up temp files: {e}')
        
        # Create a ContentFile with MP3 data
        original_name = os.path.splitext(audio_file.name)[0]
        mp3_content = ContentFile(mp3_data, name=f'{original_name}.mp3')
        
        return mp3_content
        
    except Exception as e:
        logging.exception(f'Error converting audio to MP3: {e}')
        raise


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
    input_type = request.data.get('input_type', 'text')  # 'text' or 'voice'
    script_input = request.data.get('script_input')
    voice_provider = request.data.get('voice_provider')  # e.g., 'microsoft', 'elevenlabs'
    voice_id = request.data.get('voice_id')  # e.g., 'en-US-JennyNeural'
    voice_language = request.data.get('voice_language')  # e.g., 'English (United States)'

    # Accept either an uploaded file (multipart/form-data) as 'image_file'
    # or a direct source_url (for backward compatibility)
    uploaded_file = request.FILES.get('image_file') if hasattr(request, 'FILES') else None
    source_url = request.data.get('source_url') if not uploaded_file else None
    
    # Accept audio file for voice input type
    audio_file = request.FILES.get('audio_file') if hasattr(request, 'FILES') else None

    # Validation based on input type
    if not name:
        return Response({"detail": "name is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not uploaded_file and not source_url:
        return Response({"detail": "image_file or source_url is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if input_type == 'text' and not script_input:
        return Response({"detail": "script_input is required for text input type"}, status=status.HTTP_400_BAD_REQUEST)
    
    if input_type == 'voice' and not audio_file:
        return Response({"detail": "audio_file is required for voice input type"}, status=status.HTTP_400_BAD_REQUEST)

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

    # Build the request payload based on input type
    talk_payload = {
        'source_url': source_url,
        "config": {
            "driver_url": "bank://lively/",
            "motion_factor": 1.0,
            "stitch": True,
        }
    }

    if input_type == 'voice':
        # Upload audio file to GCP (convert to MP3 first)
        gcp_audio_url = None
        if audio_file and isinstance(audio_file, InMemoryUploadedFile):
            try:
                # Convert audio to MP3 format
                logging.info(f'Converting audio file {audio_file.name} to MP3...')
                mp3_file = convert_audio_to_mp3(audio_file)
                
                # Generate unique blob name for the MP3 audio
                original_name = os.path.splitext(audio_file.name)[0]
                blob_name = generate_unique_blob_name('audio', f'{original_name}.mp3')
                
                # Upload MP3 to GCP and get public URL
                gcp_audio_url = upload_file_object_to_gcp(mp3_file, blob_name)
                logging.info(f'Successfully uploaded MP3 audio to GCP: {gcp_audio_url}')
                
            except Exception as e:
                logging.exception('Error converting/uploading audio to GCP: %s', e)
                return Response({"detail": f"Failed to process audio file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if not gcp_audio_url:
            return Response({"detail": "Failed to get audio URL"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # For voice input, use audio type
        talk_payload['script'] = {
            'type': 'audio',
            'audio_url': gcp_audio_url
        }
        
    else:
        # For text input, process with AI and use text type
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

        talk_payload['script'] = {
            'type': 'text',
            'input': enhanced_script,
        }
        
        if voice_provider and voice_id:
            # Keep backward compatibility: voice_provider might be something like 'amazon' or a dict
            provider_data = {
                'type': voice_provider,
                'voice_id': voice_id
            }
            if voice_language:
                provider_data['language'] = voice_language
            talk_payload['script']['provider'] = provider_data

    print(talk_payload)

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
        script_input=script_input if script_input else "",
        talk_id=talk_id,
        status='created',
        voice_provider=voice_provider or 'Custom',
        voice_id=voice_id or 'Custom_voice_id',
        config={'fluent': False, 'pad_audio': 0.0},
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


# ============================================
# Password Reset Views
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """Request OTP for password reset"""
    from .serializers import PasswordResetRequestSerializer
    from .models import PasswordResetOTP
    from .email_service import generate_otp, send_otp_email
    from django.contrib.auth import get_user_model
    
    serializer = PasswordResetRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    
    # Check if user exists
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal if email exists or not for security
        return Response({"detail": "If the email exists, you will receive an OTP."}, status=status.HTTP_200_OK)
    
    # Generate OTP
    otp = generate_otp()
    
    # Save OTP to database
    PasswordResetOTP.objects.create(email=email, otp=otp)
    
    # Send email
    email_sent = send_otp_email(email, otp)
    
    if email_sent:
        return Response({"detail": "OTP sent to your email."}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Failed to send email. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_and_reset_password(request):
    """Verify OTP and reset password"""
    from .serializers import PasswordResetVerifySerializer
    from .models import PasswordResetOTP
    from django.contrib.auth import get_user_model
    
    serializer = PasswordResetVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    otp = serializer.validated_data['otp']
    new_password = serializer.validated_data['new_password']
    
    # Find valid OTP
    try:
        otp_record = PasswordResetOTP.objects.filter(
            email=email,
            otp=otp,
            is_used=False
        ).order_by('-created_at').first()
        
        if not otp_record:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not otp_record.is_valid():
            return Response({"detail": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark OTP as used
        otp_record.is_used = True
        otp_record.save()
        
        # Reset password
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        logging.exception(f"Error resetting password: {e}")
        return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================
# Social Feed Views
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_public_videos(request):
    """Get paginated list of public videos for social feed"""
    from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
    
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 10)
    
    try:
        page_size = int(page_size)
        if page_size > 50:  # Limit max page size
            page_size = 50
    except ValueError:
        page_size = 10
    
    # Get public videos with completed status
    videos = VideoGeneration.objects.filter(
        is_public=True,
        status='done'
    ).select_related('user').prefetch_related('likes')
    
    paginator = Paginator(videos, page_size)
    
    try:
        videos_page = paginator.page(page)
    except PageNotAnInteger:
        videos_page = paginator.page(1)
    except EmptyPage:
        videos_page = paginator.page(paginator.num_pages)
    
    serializer = VideoGenerationSerializer(
        videos_page.object_list,
        many=True,
        context={'request': request}
    )
    
    return Response({
        'results': serializer.data,
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': videos_page.number,
        'has_next': videos_page.has_next(),
        'has_previous': videos_page.has_previous()
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_video_publish(request, pk):
    """Toggle video public/private status"""
    try:
        video = VideoGeneration.objects.get(pk=pk, user=request.user)
    except VideoGeneration.DoesNotExist:
        return Response({"detail": "Video not found."}, status=status.HTTP_404_NOT_FOUND)
    
    video.is_public = not video.is_public
    video.save()
    
    serializer = VideoGenerationSerializer(video, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_video(request, pk):
    """Like or unlike a video"""
    from .models import VideoLike
    
    try:
        video = VideoGeneration.objects.get(pk=pk, is_public=True)
    except VideoGeneration.DoesNotExist:
        return Response({"detail": "Video not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if already liked
    like, created = VideoLike.objects.get_or_create(user=request.user, video=video)
    
    if not created:
        # Unlike
        like.delete()
        return Response({"detail": "Video unliked.", "is_liked": False})
    else:
        # Liked
        return Response({"detail": "Video liked.", "is_liked": True})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_video_view(request, pk):
    """Record a view on a video - only counts unique views per user"""
    from .models import VideoView
    
    try:
        video = VideoGeneration.objects.get(pk=pk, is_public=True)
    except VideoGeneration.DoesNotExist:
        return Response({"detail": "Video not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Get client IP
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(',')[0]
    else:
        ip_address = request.META.get('REMOTE_ADDR')
    
    # Use get_or_create to ensure only one view per user per video
    view, created = VideoView.objects.get_or_create(
        user=request.user,
        video=video,
        defaults={'ip_address': ip_address}
    )
    
    if created:
        # Update view count only if it's a new view
        video.views_count = video.views.count()
        video.save()
        return Response({"detail": "View recorded.", "views_count": video.views_count, "is_new_view": True})
    else:
        return Response({"detail": "View already recorded.", "views_count": video.views_count, "is_new_view": False})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_heygen_video(request):
    """
    Create HeyGen-style video endpoint.
    For now, just logs the data and returns success.
    """
    try:
        # Log all received data
        print("=== HeyGen Video Creation Request ===")
        print(f"User: {request.user.username}")
        print(f"Project Name: {request.data.get('project_name')}")
        print(f"Input Type: {request.data.get('input_type')}")
        print(f"Script: {request.data.get('script')}")
        print(f"Avatar Shape: {request.data.get('avatar_shape')}")
        print(f"Background Type: {request.data.get('background_type')}")
        print(f"Need Subtitles: {request.data.get('need_subtitles')}")
        print(f"Avatar Scale: {request.data.get('avatar_scale')}")
        print(f"Avatar X: {request.data.get('avatar_x')}")
        print(f"Avatar Y: {request.data.get('avatar_y')}")
        print(f"Selected Voice ID: {request.data.get('voice_id')}")
        print(f"Selected Voice Name: {request.data.get('voice_name')}")
        
        # Log files
        if 'avatar_file' in request.FILES:
            avatar_file = request.FILES['avatar_file']
            print(f"Avatar File: {avatar_file.name} ({avatar_file.size} bytes)")
        
        if 'background_file' in request.FILES:
            bg_file = request.FILES['background_file']
            print(f"Background File: {bg_file.name} ({bg_file.size} bytes)")
        
        if 'audio_file' in request.FILES:
            audio_file = request.FILES['audio_file']
            print(f"Audio File: {audio_file.name} ({audio_file.size} bytes)")
        
        print("=== End of Request ===")
        
        # Return success response
        return Response({
            "status": "success",
            "message": "HeyGen video creation request received",
            "data": {
                "project_name": request.data.get('project_name'),
                "input_type": request.data.get('input_type'),
                "avatar_shape": request.data.get('avatar_shape'),
                "background_type": request.data.get('background_type'),
                "need_subtitles": request.data.get('need_subtitles'),
                "avatar_position": {
                    "x": request.data.get('avatar_x'),
                    "y": request.data.get('avatar_y'),
                    "scale": request.data.get('avatar_scale')
                }
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logging.error(f"Error in create_heygen_video: {str(e)}")
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
