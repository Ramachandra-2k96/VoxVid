from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"OTP for {self.email} - {self.otp}"

    class Meta:
        ordering = ['-created_at']


class VideoGeneration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_generations')
    name = models.CharField(max_length=255)
    
    # Platform identifier: 'd-id' or 'heygen'
    platform = models.CharField(max_length=20, default='d-id')
    
    # Common fields
    source_url = models.URLField()  # GCP public URL of uploaded image
    script_input = models.TextField(blank=True, null=True)
    talk_id = models.CharField(max_length=255, unique=True)  # D-ID talk_id or HeyGen video_id
    status = models.CharField(max_length=50, default='created')
    result_url = models.URLField(blank=True, null=True)  # GCP public URL of final video
    audio_url = models.URLField(blank=True, null=True)
    
    # D-ID specific fields
    image_id = models.CharField(max_length=255, blank=True, null=True)
    image_s3_url = models.URLField(blank=True, null=True)
    
    # HeyGen specific fields
    talking_photo_id = models.CharField(max_length=255, blank=True, null=True)
    talking_photo_url = models.URLField(blank=True, null=True)
    background_url = models.URLField(blank=True, null=True)  # GCP URL of background
    background_type = models.CharField(max_length=20, blank=True, null=True)  # 'image' or 'video'
    avatar_shape = models.CharField(max_length=20, blank=True, null=True)  # 'square' or 'circle'
    avatar_scale = models.FloatField(blank=True, null=True)
    avatar_x = models.FloatField(blank=True, null=True)
    avatar_y = models.FloatField(blank=True, null=True)
    need_subtitles = models.BooleanField(default=False)
    input_type = models.CharField(max_length=20, blank=True, null=True)  # 'text' or 'audio'
    
    # Voice configuration fields
    voice_provider = models.CharField(max_length=50, blank=True, null=True)
    voice_id = models.CharField(max_length=255, blank=True, null=True)
    voice_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Metadata and config
    metadata = models.JSONField(blank=True, null=True)
    config = models.JSONField(default=dict)
    
    # Social features
    is_public = models.BooleanField(default=False)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.talk_id} ({self.platform})"

    class Meta:
        ordering = ['-created_at']


class VideoLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_likes')
    video = models.ForeignKey(VideoGeneration, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'video')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} likes {self.video.name}"


class VideoView(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_views', null=True, blank=True)
    video = models.ForeignKey(VideoGeneration, on_delete=models.CASCADE, related_name='views')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'video')
        ordering = ['-created_at']

    def __str__(self):
        user_str = self.user.username if self.user else self.ip_address
        return f"View on {self.video.name} by {user_str}"

