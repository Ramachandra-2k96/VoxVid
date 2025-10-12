from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.me, name='me'),
    path('videos/', views.list_video_generations, name='list_videos'),
    path('videos/create/', views.create_video_generation, name='create_video'),
    path('videos/<int:pk>/', views.get_video_generation, name='get_video'),
    path('videos/<int:pk>/update/', views.update_video_status, name='update_video_status'),
]
