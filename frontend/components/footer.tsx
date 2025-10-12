import { Heart, Twitter, Youtube, Linkedin, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="relative mt-16 md:mt-24">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
          }}
        />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 px-6 md:px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "GeistSans, sans-serif",
                  }}
                >
                  VoxVid
                </h3>
                <p
                  className="text-white/80 text-sm md:text-base leading-relaxed max-w-md"
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                >
                  Transform your scripts into stunning videos with AI-powered voice synthesis and avatar technology.
                  Create professional content in minutes.
                </p>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & Legal */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <a
                href="https://twitter.com/voxvid"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@voxvid"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Subscribe on YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/voxvid"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@voxvid.com"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Send us an email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <a
                href="/privacy"
                className="text-white/50 hover:text-white/80 transition-colors duration-200 text-xs"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-white/50 hover:text-white/80 transition-colors duration-200 text-xs"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
