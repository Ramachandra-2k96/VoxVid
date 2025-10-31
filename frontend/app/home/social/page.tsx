"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreVertical, Loader2, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Video {
  id: number;
  name: string;
  source_url: string;
  result_url: string;
  script_input: string;
  status: string;
  views_count: number;
  likes_count: number;
  is_liked: boolean;
  user_info: {
    id: number;
    username: string;
    email: string;
  };
  voice_provider?: string;
  voice_id?: string;
  created_at: string;
}

export default function SocialPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  useEffect(() => {
    fetchVideos();
  }, [page]);

  useEffect(() => {
    if (videos.length > 0 && currentIndex < videos.length) {
      const currentVideo = videoRefs.current.get(currentIndex);
      if (currentVideo) {
        currentVideo.play().catch(err => console.log("Autoplay failed:", err));
        recordView(videos[currentIndex].id);
      }
      
      videoRefs.current.forEach((video, index) => {
        if (index !== currentIndex) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }
  }, [currentIndex, videos]);

  const fetchVideos = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000';
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}');
      const response = await fetch(
        `${API_URL}/api/social/videos/?page=${page}&page_size=12`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setVideos(data.results);
        } else {
          setVideos((prev) => [...prev, ...data.results]);
        }
        setHasMore(data.next !== null);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: number) => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000';
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}');
      const response = await fetch(`${API_URL}/api/social/videos/${videoId}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideos((prev) =>
          prev.map((video) =>
            video.id === videoId
              ? {
                  ...video,
                  is_liked: data.is_liked,
                  likes_count: data.is_liked
                    ? video.likes_count + 1
                    : video.likes_count - 1,
                }
              : video
          )
        );
        if (selectedVideo?.id === videoId) {
          setSelectedVideo((prev) =>
            prev
              ? {
                  ...prev,
                  is_liked: data.is_liked,
                  likes_count: data.is_liked
                    ? prev.likes_count + 1
                    : prev.likes_count - 1,
                }
              : null
          );
        }
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const recordView = async (videoId: number) => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000';
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}');
      const response = await fetch(`${API_URL}/api/social/videos/${videoId}/view/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.is_new_view) {
          setVideos((prev) =>
            prev.map((video) =>
              video.id === videoId
                ? { ...video, views_count: data.views_count }
                : video
            )
          );
        }
      }
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const itemHeight = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
      
      if (newIndex >= videos.length - 2 && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }
  }, [currentIndex, videos.length, hasMore, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach(video => {
      video.muted = !isMuted;
    });
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black flex justify-center"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          height: '100dvh',
        }}
      >
        <div className="w-full max-w-[500px] relative">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="relative h-screen w-full snap-start snap-always flex items-center justify-center"
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(index, el);
              }}
              src={video.result_url}
              loop
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover bg-black"
              onClick={() => {
                const videoEl = videoRefs.current.get(index);
                if (videoEl) {
                  if (videoEl.paused) {
                    videoEl.play();
                  } else {
                    videoEl.pause();
                  }
                }
              }}
            />

            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {video.user_info.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-white drop-shadow-lg">
                  {video.user_info.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-10">
              <button
                onClick={() => handleLike(video.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="relative">
                  <Heart
                    className={`h-8 w-8 drop-shadow-lg transition-all ${
                      video.is_liked
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-white group-hover:scale-110"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-white drop-shadow-lg">
                  {video.likes_count > 999
                    ? `${(video.likes_count / 1000).toFixed(1)}K`
                    : video.likes_count}
                </span>
              </button>

              <button
                onClick={() => setSelectedVideo(video)}
                className="flex flex-col items-center gap-1 group"
              >
                <MessageCircle className="h-8 w-8 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white drop-shadow-lg">
                  {video.views_count > 999
                    ? `${(video.views_count / 1000).toFixed(1)}K`
                    : video.views_count}
                </span>
              </button>

              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: video.name,
                      text: `Check out this amazing video: ${video.name}`,
                      url: video.result_url,
                    }).catch((error) => console.log('Error sharing:', error));
                  } else {
                    navigator.clipboard.writeText(video.result_url);
                    alert('Video URL copied to clipboard!');
                  }
                }}
                className="flex flex-col items-center gap-1 group"
              >
                <Share2 className="h-7 w-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={toggleMute}
                className="flex flex-col items-center gap-1 group"
              >
                {isMuted ? (
                  <VolumeX className="h-7 w-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                ) : (
                  <Volume2 className="h-7 w-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 pr-20 z-10 space-y-2">
              <h3 className="font-bold text-white text-lg drop-shadow-lg line-clamp-1">
                {video.name}
              </h3>
              <p className="text-sm text-white/90 drop-shadow-lg line-clamp-2">
                {video.script_input}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {video.voice_provider && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {video.voice_provider}
                  </Badge>
                )}
              </div>
            </div>

            {index === videos.length - 1 && hasMore && loading && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-full sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl">Video Details</DialogTitle>
            <DialogDescription>
              Created by {selectedVideo?.user_info.username}
            </DialogDescription>
          </DialogHeader>
          {selectedVideo && (
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
              <div className="relative w-full bg-black rounded-lg overflow-hidden">
                <video
                  src={selectedVideo.result_url}
                  controls
                  autoPlay
                  className="w-full max-h-[60vh] object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {selectedVideo.user_info.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedVideo.user_info.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedVideo.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant={selectedVideo.is_liked ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLike(selectedVideo.id)}
                  className={selectedVideo.is_liked ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      selectedVideo.is_liked ? "fill-white" : ""
                    }`}
                  />
                  {selectedVideo.likes_count}
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg mb-2">{selectedVideo.name}</h3>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                  Script
                </h4>
                <p className="text-sm leading-relaxed">
                  {selectedVideo.script_input}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedVideo.likes_count}</span>
                  <span className="text-muted-foreground">likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedVideo.views_count}</span>
                  <span className="text-muted-foreground">views</span>
                </div>
              </div>

              {selectedVideo.voice_provider && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                      Voice Configuration
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="px-3 py-1">
                        Provider: {selectedVideo.voice_provider}
                      </Badge>
                      {selectedVideo.voice_id && (
                        <Badge variant="outline" className="px-3 py-1">
                          Voice ID: {selectedVideo.voice_id}
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
