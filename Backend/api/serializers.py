from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import VideoGeneration, Profile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name")
        read_only_fields = ("id",)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('id', 'user', 'bio', 'location', 'website', 'avatar', 'avatar_url', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None

    def update(self, instance, validated_data):
        # Handle avatar upload
        avatar = validated_data.get('avatar')
        if avatar:
            instance.avatar = avatar
        return super().update(instance, validated_data)


class VideoGenerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoGeneration
        fields = '__all__'
        read_only_fields = ('user', 'talk_id', 'created_at', 'modified_at')

