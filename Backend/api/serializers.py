from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import VideoGeneration, Profile, PasswordResetOTP, VideoLike, VideoView

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
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    user_info = serializers.SerializerMethodField()

    class Meta:
        model = VideoGeneration
        fields = '__all__'
        read_only_fields = ('user', 'talk_id', 'created_at', 'modified_at', 'views_count')

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_user_info(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email
        }


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(min_length=8, write_only=True)


class VideoLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoLike
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

