"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroImage from "@/components/hero-image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FAQSection from "@/components/faq-section"
import SaveReviewRestoreSection from "@/components/save-review-restore-section"
import VideoCustomizationSection from "@/components/video-customization-section"
import WhyChooseVoxvidSection from "@/components/why-choose-voxvid-section"
import VideoCreationTestimonialsSection from "@/components/video-creation-testimonials-section"

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-black text-white font-geist transition-all duration-300 pt-[108px] sm:pt-28"}`}
    >

      {/* Navigation */}
      <Navbar isBannerVisible={false} />

      {/* Rest of the content remains the same... */}
      <div className="max-w-[1920px] mx-auto relative px-6 md:px-8">
        {/* Hero Section */}
        <section className="relative rounded-[16px] rounded-all-devices mt-2 mb-6 md:h-[calc(100vh-144px)] font-geist text-white flex flex-col">
          {/* Gradient Background Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[16px]">
            <div
              className="absolute inset-0 w-full h-full rounded-[16px]"
              style={{
                background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
              }}
            />
            <div
              className="absolute inset-0 w-full h-full rounded-[16px]"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.35)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center pt-[38px] sm:pt-[50px] pb-8 md:pt-[70px] md:pb-12 z-10 flex flex-col h-full">
            {/* Mobile Layout (Stack: Text -> Image -> Buttons) */}
            <div className="flex flex-col md:hidden">
              <div className="mb-4">
                <h1
                  className="font-semibold mb-2 overflow-visible select-text heading-with-selection"
                  style={{
                    fontSize: "clamp(36px, 8vw, 154px)",
                    lineHeight: "1.1",
                    letterSpacing: "clamp(-2px, -0.04em, -5.18998px)",
                    fontFamily: 'var(--font-geist-sans), "GeistSans Fallback", sans-serif',
                    height: "auto",
                    maxWidth: "100%",
                    paddingBottom: "0",
                    marginBottom: "0.2em",
                    color: "#FFFFFF",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                  aria-label="AI Video Generation"
                >
                  AI-Powered Script-to-
                  <br />
                  Avatar Video Generation
                </h1>
               <p
                    className="mx-auto h-auto select-text mb-3"
                    style={{
                      fontFamily:
                        'GeistMono, ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
                      fontSize: "clamp(14px, 4vw, 22px)",
                      lineHeight: "1.3",
                      fontWeight: "400",
                      letterSpacing: "normal",
                      maxWidth: "2xl",
                      color: "#FFFFFF",
                      backgroundColor: "transparent",
                      ["--selection-text-color" as any]: "#FFFFFF",
                      ["--selection-background-color" as any]: "#000000",
                    }}
                  >

                  Create professional videos from text scripts. Choose voices, avatars, and styles — generate engaging content instantly.
                </p>
              </div>

              {/* Image in the middle for mobile */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-full">
                  <HeroImage />
                </div>
              </div>

              {/* Buttons at the bottom for mobile */}
              <div>
                <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                  <Link
                    href="/login"
                    className="bg-white hover:bg-gray-100 flex items-center justify-center px-4 sm:px-6 w-full rounded-lg shadow-lg font-mono text-xs sm:text-sm md:text-base font-semibold tracking-wider text-black h-[50px] sm:h-[60px]"
                  >
                    LOGIN
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Layout (Original) */}
            <div className="hidden md:flex md:flex-col md:flex-grow">
              <h1
                className="font-semibold mb-2 whitespace-nowrap overflow-visible select-text heading-with-selection"
                style={{
                  fontSize: "clamp(36px, 8vw, 154px)",
                  lineHeight: "1.1",
                  letterSpacing: "clamp(-2px, -0.04em, -5.18998px)",
                  fontFamily: 'var(--font-geist-sans), "GeistSans Fallback", sans-serif',
                  height: "auto",
                  maxWidth: "100%",
                  paddingBottom: "0",
                  marginBottom: "0.2em",
                  color: "#FFFFFF",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
                aria-label="AI Video Generation"
              >
                AI Video Generation
              </h1>
              <p
                  className="mx-auto h-auto select-text mb-3"
                  style={{
                    fontFamily:
                      'GeistMono, ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
                    fontSize: "clamp(14px, 4vw, 22px)",
                    lineHeight: "1.3",
                    fontWeight: "400",
                    letterSpacing: "normal",
                    maxWidth: "2xl",
                    color: "#FFFFFF",
                    backgroundColor: "transparent",
                    ["--selection-text-color" as any]: "#FFFFFF",
                    ["--selection-background-color" as any]: "#000000",
                  }}
                >

                Create professional videos from text scripts — choose voices, avatars, and styles. Generate engaging content instantly.
              </p>
              <div className="flex flex-row justify-center gap-3 md:gap-4 mb-8">
                <Link
                  href="/login"
                  className="bg-white hover:bg-gray-100 flex items-center justify-center px-4 md:px-6 lg:px-8 rounded-lg shadow-lg font-mono text-sm md:text-base font-semibold tracking-wider text-black h-[50px] md:h-[60px] min-w-[180px] md:min-w-[220px]"
                >
                  LOGIN
                </Link>
              </div>
              <div className="relative w-full flex-grow flex items-center justify-center rounded-md overflow-hidden">
                <div className="w-full sm:w-[85%] md:max-w-[1200px] mx-auto">
                  <HeroImage />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of sections remain the same... */}
        <section className="pb-12 md:pb-16 bg-black mt-[60px] md:mt-[112px]">
          <div className="container mx-auto px-4 text-center">
            <p
              className="uppercase mb-6 md:mb-8"
              style={{
                fontFamily:
                  'GeistMono, ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
                fontSize: "14px",
                lineHeight: "18px",
                fontWeight: "400",
                letterSpacing: "0.5px",
                color: "#999999",
              }}
            >
              Works wherever you create
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-y-8 sm:gap-y-12 gap-x-6 md:gap-x-8 mb-8 md:mb-12 max-w-6xl mx-auto">
              <CompanyName name="YouTube" />
              <CompanyName name="TikTok" />
              <CompanyName name="Instagram" />
              <CompanyName name="LinkedIn" />
              <CompanyName name="Twitter" />
              <CompanyName name="ElevenLabs" noWrapDesktop={true} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-12 gap-x-6 md:gap-x-8 max-w-4xl mx-auto">
              <CompanyName name="Respeecher" />
              <CompanyName name="Synthesia" noWrapDesktop={true} />
              <CompanyName name="HeyGen" noWrapDesktop={true} />
              <CompanyName name="Runway ML" noWrapDesktop={true} />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-12">
            <h2
              className="mb-4 font-semibold"
              style={{
                backgroundImage: "linear-gradient(rgb(245, 245, 245), rgb(245, 245, 245) 29%, rgb(153, 153, 153))",
                color: "transparent",
                fontFamily: "GeistSans, sans-serif",
                fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: 600,
                letterSpacing: "clamp(-1.5px, -0.04em, -2.08px)",
                lineHeight: "1.15",
                textAlign: "center",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              5,000+ Creators Love VoxVid
            </h2>
            <p
              className="max-w-3xl mx-auto text-white/80"
              style={{
                fontFamily: "GeistMono, monospace",
                fontSize: "clamp(16px, 3vw, 22px)",
                lineHeight: "1.4",
                textAlign: "center",
              }}
            >
              From solo entrepreneurs to global brands — trusted worldwide for AI-powered video creation.
            </p>
          </div>

          <div className="space-y-8 overflow-hidden">
            <div className="relative">
              <div className="flex animate-scroll-left whitespace-nowrap">
                <div className="flex">
                  {[
                    "San Francisco",
                    "New York",
                    "London",
                    "Berlin",
                    "Tokyo",
                    "Sydney",
                    "Toronto",
                    "Amsterdam",
                    "Barcelona",
                    "Singapore",
                    "Mumbai",
                    "São Paulo",
                    "Stockholm",
                    "Tel Aviv",
                    "Austin",
                    "Seattle",
                    "Dublin",
                    "Copenhagen",
                    "Zurich",
                    "Melbourne",
                  ]
                    .concat([
                      "San Francisco",
                      "New York",
                      "London",
                      "Berlin",
                      "Tokyo",
                      "Sydney",
                      "Toronto",
                      "Amsterdam",
                      "Barcelona",
                      "Singapore",
                      "Mumbai",
                      "São Paulo",
                      "Stockholm",
                      "Tel Aviv",
                      "Austin",
                      "Seattle",
                      "Dublin",
                      "Copenhagen",
                      "Zurich",
                      "Melbourne",
                    ])
                    .map((city, index) => (
                      <span
                        key={index}
                        style={{
                          fontFamily: 'GeistSans, "GeistSans Fallback", sans-serif',
                          fontSize: "20px",
                          lineHeight: "28px",
                          fontWeight: "700",
                          letterSpacing: "normal",
                          color: "#999999",
                          whiteSpace: "nowrap",
                          padding: "0 1rem",
                        }}
                      >
                        {city}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex animate-scroll-right whitespace-nowrap">
                <div className="flex">
                  {[
                    "Vancouver",
                    "Paris",
                    "Los Angeles",
                    "Boston",
                    "Chicago",
                    "Miami",
                    "Denver",
                    "Portland",
                    "Montreal",
                    "Edinburgh",
                    "Prague",
                    "Vienna",
                    "Helsinki",
                    "Oslo",
                    "Lisbon",
                    "Madrid",
                    "Rome",
                    "Brussels",
                    "Warsaw",
                    "Budapest",
                  ]
                    .concat([
                      "Vancouver",
                      "Paris",
                      "Los Angeles",
                      "Boston",
                      "Chicago",
                      "Miami",
                      "Denver",
                      "Portland",
                      "Montreal",
                      "Edinburgh",
                      "Prague",
                      "Vienna",
                      "Helsinki",
                      "Oslo",
                      "Lisbon",
                      "Madrid",
                      "Rome",
                      "Brussels",
                      "Warsaw",
                      "Budapest",
                    ])
                    .map((city, index) => (
                      <span
                        key={index}
                        style={{
                          fontFamily: 'GeistSans, "GeistSans Fallback", sans-serif',
                          fontSize: "20px",
                          lineHeight: "28px",
                          fontWeight: "700",
                          letterSpacing: "normal",
                          color: "#999999",
                          whiteSpace: "nowrap",
                          padding: "0 1rem",
                        }}
                      >
                        {city}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SaveReviewRestoreSection />
        <VideoCustomizationSection />
        <WhyChooseVoxvidSection />
        <VideoCreationTestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  )
}

function CompanyName({
  name,
  noWrapDesktop = false,
  className = "",
}: { name: string; noWrapDesktop?: boolean; className?: string }) {
  return (
    <div className={`flex justify-center items-center h-10 px-2 ${className}`}>
      <span
        className={`text-[#999999] text-center ${noWrapDesktop ? "md:whitespace-nowrap" : ""}`}
        style={{
          fontFamily: 'GeistSans, "GeistSans Fallback", sans-serif',
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: "700",
          letterSpacing: "normal",
        }}
      >
        {name}
      </span>
    </div>
  )
}


