"use client"

export default function HeroImage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="w-full bg-black rounded-[16px] overflow-hidden">
        <img
          src="/images/hero-interface.jpg"
          alt="VoxVid AI Video Narrator interface showing script-to-video generation with avatar selection"
          className="w-full h-auto rounded-[16px]"
        />
      </div>
    </div>
  )
}
