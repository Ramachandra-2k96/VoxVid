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
    source_url = models.URLField()  # GCP public URL of uploaded image
    script_input = models.TextField()
    talk_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50, default='created')
    result_url = models.URLField(blank=True, null=True)  # GCP public URL of final video
    audio_url = models.URLField(blank=True, null=True)
    # Fields returned by D-ID image upload
    image_id = models.CharField(max_length=255, blank=True, null=True)
    image_s3_url = models.URLField(blank=True, null=True)
    # Voice configuration fields
    voice_provider = models.CharField(max_length=50, blank=True, null=True)
    voice_id = models.CharField(max_length=255, blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    config = models.JSONField(default=dict)
    # Social features
    is_public = models.BooleanField(default=False)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.talk_id}"

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

