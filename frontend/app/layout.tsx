import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { GeistSans } from "geist/font/sans"

export const metadata: Metadata = {
  title: "VoxVid – AI-Powered Script-to-Avatar Video Generation | Create Professional Videos Instantly",
  description:
    "Transform text scripts into professional videos with AI voices and avatars. VoxVid creates engaging video content instantly — no cameras, studios, or editing skills required.",
  keywords:
    "AI video generation, script to video, text to video, AI avatars, voice synthesis, video creation, content creation, marketing videos, educational videos",
  authors: [{ name: "VoxVid Team" }],
  creator: "VoxVid",
  publisher: "VoxVid",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voxvid.com",
    siteName: "VoxVid - AI Video Generation",
    title: "VoxVid – AI-Powered Script-to-Avatar Video Generation",
    description:
      "Create professional videos from text scripts instantly. Choose from AI voices, avatars, and styles. Perfect for content creators, marketers, and educators.",
    images: [
      {
        url: "https://voxvid.com/images/og-video.jpeg",
        width: 1200,
        height: 630,
        alt: "VoxVid AI video generation with avatars and voice synthesis",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoxVid – AI-Powered Script-to-Avatar Video Generation",
    description:
      "Transform scripts into professional videos with AI. Choose voices, avatars, and styles — create engaging content instantly.",
    images: ["https://voxvid.com/images/og-video.jpeg"],
    creator: "@jackjack_eth",
    site: "@voxvid_ai",
  },
  alternates: {
    canonical: "https://voxvid.com",
  },
  category: "Content Creation",
  classification: "Video Production Tools",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  generator: "Next.js",
  applicationName: "VoxVid - AI Video Generation",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@geist-ui/core@latest/dist/geist-ui.css" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Software Application JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "VoxVid - AI Video Generation",
              description:
                "VoxVid transforms text scripts into professional videos using AI voices and avatars. Create engaging video content instantly without cameras, studios, or editing skills.",
              url: "https://voxvid.com",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Web-based",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "VoxVid",
                url: "https://voxvid.com",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "5000",
              },
              featureList: [
                "AI-powered script to video conversion",
                "Professional voice synthesis options",
                "Diverse avatar selection and customization",
                "Instant video generation",
                "Multiple video styles and templates",
                "Cloud storage and sharing",
              ],
              audience: {
                "@type": "Audience",
                audienceType: "Content creators, marketers, educators, businesses",
              },
            }),
          }}
        />

        {/* FAQ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How does VoxVid create videos from text?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "VoxVid uses advanced AI to convert your scripts into professional videos. Our AI analyzes your text, generates appropriate visuals, selects natural voice acting, and creates smooth video transitions — all automatically.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is it free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes — there's a generous free tier to get started. Pro and Business plans unlock unlimited generations, custom avatars, and premium voice options.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I use my own voice or avatar?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely! Upload your own voice recordings or create custom avatars. Pro users can also request specific voice styles or avatar designs tailored to their brand.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Where are my videos stored?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Your videos are stored securely in the cloud with enterprise-grade encryption. You can download, share, or embed them anywhere. We never use your content for training our AI models.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does it take to generate a video?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most videos are ready in 2-5 minutes depending on length and complexity. Short clips can be generated in under a minute.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What video formats do you support?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "VoxVid generates videos in MP4 format, optimized for web and social media platforms. You can download in multiple resolutions for different use cases.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Video Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: "VoxVid AI Video Generation - Script to Video Demo",
              description:
                "See how VoxVid transforms text scripts into professional videos with AI voices and avatars. Create engaging content instantly without cameras or editing skills.",
              thumbnailUrl: "https://voxvid.com/images/video-thumbnail.jpeg",
              uploadDate: "2024-12-01",
              duration: "PT45S",
              contentUrl:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yoyo-save-2-DUbUp5aKE9GtNY9Diok2eG6SW2qHCX.mp4",
              embedUrl: "https://voxvid.com",
              publisher: {
                "@type": "Organization",
                name: "VoxVid",
                logo: {
                  "@type": "ImageObject",
                  url: "https://voxvid.com/android-chrome-512x512.png",
                },
              },
              keywords: "AI video generation, script to video, text to video, AI avatars, voice synthesis",
              category: "Content Creation",
            }),
          }}
        />

        {/* Additional Video Schema for Voice & Avatar Demo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: "VoxVid Voice & Avatar Selection - Customize Your Videos",
              description:
                "Choose from professional AI voices and diverse avatars to match your brand. VoxVid lets you customize every aspect of your video content creation.",
              thumbnailUrl: "https://voxvid.com/images/avatar-thumbnail.jpeg",
              uploadDate: "2024-12-01",
              duration: "PT60S",
              contentUrl:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favorites-FFCUeeEFzfxDBIhgGACi7YGpYQZbnU.mp4",
              embedUrl: "https://voxvid.com",
              publisher: {
                "@type": "Organization",
                name: "VoxVid",
                logo: {
                  "@type": "ImageObject",
                  url: "https://voxvid.com/android-chrome-512x512.png",
                },
              },
              keywords: "AI voices, avatars, video customization, content creation, AI video tools",
              category: "Content Creation",
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
