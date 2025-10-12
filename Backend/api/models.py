from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class VideoGeneration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_generations')
    name = models.CharField(max_length=255)
    source_url = models.URLField()
    script_input = models.TextField()
    talk_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50, default='created')
    result_url = models.URLField(blank=True, null=True)
    audio_url = models.URLField(blank=True, null=True)
    # Store original uploaded image as base64 for UI preview
    original_image_base64 = models.TextField(blank=True, null=True)
    # Fields returned by D-ID image upload
    image_id = models.CharField(max_length=255, blank=True, null=True)
    image_s3_url = models.URLField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    config = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.talk_id}"

