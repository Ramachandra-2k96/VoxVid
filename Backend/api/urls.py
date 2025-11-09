from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.me, name='me'),
    
    # Password Reset
    path('auth/password-reset/request/', views.request_password_reset, name='request_password_reset'),
    path('auth/password-reset/verify/', views.verify_otp_and_reset_password, name='verify_reset_password'),
    
    # Profile
    path('profile/', views.profile_detail, name='profile_detail'),
    
    # Videos
    path('videos/', views.list_video_generations, name='list_videos'),
    path('videos/create/', views.create_video_generation, name='create_video'),
    path('videos/<int:pk>/', views.get_video_generation, name='get_video'),
    path('videos/<int:pk>/update/', views.update_video_status, name='update_video_status'),
    path('videos/<int:pk>/publish/', views.toggle_video_publish, name='toggle_video_publish'),
    
    # Social Feed
    path('social/videos/', views.get_public_videos, name='get_public_videos'),
    path('social/videos/<int:pk>/like/', views.like_video, name='like_video'),
    path('social/videos/<int:pk>/view/', views.record_video_view, name='record_video_view'),
    
    # AI Enhancement
    path('ai/enhance/', views.ai_enhance_script, name='ai_enhance_script'),
    
    # HeyGen Style Video
    path('heygen/create/', views.create_heygen_video, name='create_heygen_video'),
]
