"use client"

import Link from "next/link"
import { ArrowLeft, Home, FileText, Scale, Shield, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-geist">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            style={{ fontFamily: "GeistMono, monospace" }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{ fontFamily: "GeistSans, sans-serif" }}
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 border-b border-white/10">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400/20 to-pink-400/20 flex items-center justify-center mb-6 mx-auto border border-cyan-400/30">
            <Scale className="h-8 w-8 text-cyan-400" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "GeistSans, sans-serif",
            }}
          >
            Terms and Conditions
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: "GeistMono, monospace" }}>
            Please read these terms carefully before using VoxVid
          </p>
          <p className="text-white/50 text-sm mt-4" style={{ fontFamily: "GeistMono, monospace" }}>
            Last Updated: October 31, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Table of Contents */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <FileText className="h-6 w-6 text-cyan-400" />
              Table of Contents
            </h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "1. Acceptance of Terms",
                "2. Description of Service",
                "3. User Accounts",
                "4. User Responsibilities",
                "5. Intellectual Property Rights",
                "6. Content Guidelines",
                "7. Payment and Billing",
                "8. Subscription Plans",
                "9. Refund Policy",
                "10. API Usage and Limits",
                "11. Prohibited Uses",
                "12. Termination",
                "13. Disclaimers",
                "14. Limitation of Liability",
                "15. Indemnification",
                "16. Changes to Terms",
                "17. Governing Law",
                "18. Dispute Resolution",
                "19. Privacy and Data Protection",
                "20. Contact Information"
              ].map((item, index) => (
                <a
                  key={index}
                  href={`#section-${index + 1}`}
                  className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors flex items-center gap-2"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  {item}
                </a>
              ))}
            </nav>
          </section>

          {/* Section 1 */}
          <section id="section-1" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">1.</span>
              Acceptance of Terms
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                By accessing or using VoxVid ("the Service"), you agree to be bound by these Terms and Conditions ("Terms"). 
                If you do not agree to these Terms, you may not access or use the Service. These Terms constitute a legally 
                binding agreement between you and VoxVid, a product of [Company Name] ("Company", "we", "us", or "our").
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by 
                reference. By using the Service, you acknowledge that you have read, understood, and agree to be bound by 
                both these Terms and our Privacy Policy.
              </p>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-orange-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  <strong>Important:</strong> You must be at least 18 years old or have reached the age of majority in 
                  your jurisdiction to use this Service. By agreeing to these Terms, you represent and warrant that you 
                  meet these age requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">2.</span>
              Description of Service
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                VoxVid is an AI-powered video creation platform that enables users to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Create videos using AI-generated voices from text scripts</li>
                <li>Upload and animate custom avatar images</li>
                <li>Select from a variety of voice providers and languages</li>
                <li>Enhance scripts using AI-powered text improvement</li>
                <li>Upload or record custom audio for video creation</li>
                <li>Manage and organize video projects</li>
                <li>Download and share created videos</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                The Service integrates with third-party AI providers including but not limited to D-ID, Amazon Polly, 
                Microsoft Azure, ElevenLabs, Google Cloud, and PlayHT for voice synthesis and video generation. We reserve 
                the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                While we strive to provide uninterrupted service, we do not guarantee that the Service will be available 
                at all times or that it will be error-free. Service availability may be affected by factors beyond our 
                control, including third-party provider outages, network issues, or maintenance requirements.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">3.</span>
              User Accounts
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                To access certain features of the Service, you must create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Immediately notify us of any unauthorized use of your account</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You are solely responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account, whether authorized by you or not. You agree to immediately notify 
                us of any unauthorized access to or use of your username or password or any other breach of security.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We reserve the right to disable any user account, at any time in our sole discretion, for any or no reason, 
                including if we believe you have violated any provision of these Terms. You may not transfer, sell, or 
                otherwise assign your account to any other person or entity.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">4.</span>
              User Responsibilities
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                As a user of the Service, you are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>All content you upload, create, or transmit through the Service</li>
                <li>Ensuring you have all necessary rights, licenses, and permissions for content you upload</li>
                <li>Complying with all applicable local, state, national, and international laws and regulations</li>
                <li>Respecting the intellectual property rights of others</li>
                <li>Not using the Service for any illegal or unauthorized purpose</li>
                <li>Not interfering with or disrupting the Service or servers or networks connected to the Service</li>
                <li>Not attempting to gain unauthorized access to any portion of the Service</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You acknowledge that you are solely responsible for obtaining and maintaining all equipment, software, and 
                services needed to access and use the Service, including but not limited to computers, mobile devices, 
                internet connectivity, and browser software.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">5.</span>
              Intellectual Property Rights
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.1 VoxVid's Intellectual Property
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                The Service and its entire contents, features, and functionality (including but not limited to all 
                information, software, text, displays, images, video, audio, design, selection, and arrangement) are owned 
                by VoxVid, its licensors, or other providers of such material and are protected by United States and 
                international copyright, trademark, patent, trade secret, and other intellectual property or proprietary 
                rights laws.
              </p>
              
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.2 License to Use the Service
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, 
                revocable license to access and use the Service for your personal or internal business purposes. This license 
                does not include any resale or commercial use of the Service or its contents; any collection and use of any 
                product listings, descriptions, or prices; any derivative use of the Service or its contents; any downloading 
                or copying of account information for the benefit of another merchant; or any use of data mining, robots, or 
                similar data gathering and extraction tools.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.3 User-Generated Content
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You retain all ownership rights to the content you create using the Service ("User Content"), including 
                scripts, images, and videos. However, by using the Service, you grant us a worldwide, non-exclusive, 
                royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works 
                of, display, and perform the User Content in connection with the Service and our business, including for 
                promoting and redistributing part or all of the Service.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You represent and warrant that: (i) you own or have obtained all necessary rights, licenses, consents, 
                permissions, and authority to grant the rights granted herein; (ii) your User Content does not violate any 
                third-party rights, including intellectual property rights, privacy rights, or publicity rights; and (iii) 
                your User Content complies with these Terms and all applicable laws.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">6.</span>
              Content Guidelines
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You agree not to upload, create, transmit, or otherwise make available any content that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, 
                    invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable</li>
                <li>Infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party</li>
                <li>Contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, 
                    or limit the functionality of any computer software or hardware</li>
                <li>Promotes illegal activities or violates any applicable laws or regulations</li>
                <li>Contains unsolicited or unauthorized advertising, promotional materials, spam, or any other form of 
                    solicitation</li>
                <li>Impersonates any person or entity or misrepresents your affiliation with a person or entity</li>
                <li>Contains personal information of minors without appropriate consent</li>
                <li>Depicts or promotes violence, self-harm, or dangerous activities</li>
                <li>Contains sexually explicit or pornographic material</li>
                <li>Promotes discrimination, hatred, or violence against individuals or groups based on race, ethnicity, 
                    religion, disability, gender, age, national origin, or sexual orientation</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We reserve the right, but not the obligation, to monitor, review, and remove any User Content that violates 
                these Terms or that we deem inappropriate for any reason. We also reserve the right to disclose any 
                information necessary to satisfy any applicable law, regulation, legal process, or governmental request.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">7.</span>
              Payment and Billing
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Certain features of the Service may require payment of fees. You agree to pay all fees associated with your 
                use of the Service according to the pricing and payment terms presented to you at the time of purchase.
              </p>
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                7.1 Payment Processing
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                All payments are processed through secure third-party payment processors. By providing payment information, 
                you represent and warrant that you are authorized to use the designated payment method and authorize us to 
                charge your payment method for all fees incurred through your account.
              </p>
              
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                7.2 Automatic Renewal
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Subscription plans automatically renew at the end of each billing period unless you cancel your subscription 
                before the renewal date. You will be charged the then-current rate for your subscription plan. We will notify 
                you of any price changes at least 30 days in advance.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                7.3 Taxes
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                All fees are exclusive of taxes, levies, or duties imposed by taxing authorities. You are responsible for 
                payment of all such taxes, levies, or duties, excluding only taxes based on our net income.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                7.4 Payment Disputes
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you believe that you have been incorrectly billed, you must contact us within 60 days of the date of the 
                disputed charge to receive an adjustment or credit. We reserve the right to investigate all payment disputes 
                and may request additional information to verify the claim.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">8.</span>
              Subscription Plans
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                VoxVid offers various subscription plans with different features, usage limits, and pricing. Plan details and 
                features are subject to change. Current plan information is available on our pricing page.
              </p>
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                8.1 Free Tier
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Our free tier provides limited access to the Service with usage restrictions. Free tier users may experience 
                reduced features, lower priority processing, and may see promotional content.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                8.2 Paid Subscriptions
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Paid subscriptions provide enhanced features, higher usage limits, and priority support. You may upgrade, 
                downgrade, or cancel your subscription at any time. Changes take effect at the start of the next billing cycle.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                8.3 Enterprise Plans
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Enterprise plans are available for organizations with specific requirements. Contact our sales team for custom 
                pricing and features. Enterprise plans may be subject to separate terms and conditions.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">9.</span>
              Refund Policy
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                All sales are final. We do not provide refunds for any payments made for the Service, except as required by 
                applicable law or as explicitly stated in a separate agreement.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you believe you are entitled to a refund based on extraordinary circumstances, you may submit a refund 
                request to our support team within 7 days of the charge. We will review all refund requests on a case-by-case 
                basis and reserve the right to grant or deny refunds at our sole discretion.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You may cancel your subscription at any time, but you will not receive a refund for any fees already paid. 
                Your subscription will remain active until the end of the current billing period, after which it will not renew.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">10.</span>
              API Usage and Limits
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Your use of the Service is subject to usage limits based on your subscription plan. These limits may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Maximum number of videos per month</li>
                <li>Maximum video duration</li>
                <li>Storage limits for uploaded content</li>
                <li>API request limits</li>
                <li>Concurrent processing limits</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you exceed your usage limits, we may suspend or limit your access to the Service until the next billing 
                period or until you upgrade your plan. We reserve the right to implement rate limiting or throttling to ensure 
                fair use of the Service.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You agree not to circumvent or attempt to circumvent any usage limits or restrictions. Any attempt to do so 
                may result in immediate termination of your account and may be subject to legal action.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">11.</span>
              Prohibited Uses
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You agree not to use the Service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written 
                    consent, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other 
                    person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or 
                    which, as determined by us, may harm the Company or users of the Service or expose them to liability</li>
                <li>To reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code of the Service</li>
                <li>To use any robot, spider, or other automatic device, process, or means to access the Service for any 
                    purpose, including monitoring or copying any of the material on the Service</li>
                <li>To introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or 
                    technologically harmful</li>
                <li>To attack the Service via a denial-of-service attack or a distributed denial-of-service attack</li>
                <li>To create deepfakes or misleading content intended to deceive, defraud, or manipulate others</li>
                <li>To generate content that violates the rights of publicity or privacy of any person</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">12.</span>
              Termination
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
                liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
                limited to a breach of the Terms.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you wish to terminate your account, you may simply discontinue using the Service or contact our support 
                team to request account deletion. Upon termination, your right to use the Service will immediately cease.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                All provisions of the Terms which by their nature should survive termination shall survive termination, 
                including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Upon termination, we may, but are not obligated to, delete your User Content. You are solely responsible for 
                maintaining backups of your User Content. We will not be liable for any loss of data or content following 
                termination of your account.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">13.</span>
              Disclaimers
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-200 text-sm font-semibold mb-2" style={{ fontFamily: "GeistMono, monospace" }}>
                  IMPORTANT LEGAL NOTICE - PLEASE READ CAREFULLY
                </p>
                <p className="text-red-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER 
                  EXPRESS OR IMPLIED.
                </p>
              </div>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING 
                BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. 
                WE DO NOT WARRANT THAT THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR 
                LOCATION; THAT ANY ERRORS OR DEFECTS WILL BE CORRECTED; THAT THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL 
                COMPONENTS; OR THAT THE RESULTS OF USING THE SERVICE WILL MEET YOUR REQUIREMENTS.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                YOU ACKNOWLEDGE THAT THE SERVICE RELIES ON THIRD-PARTY AI PROVIDERS AND SERVICES, AND WE MAKE NO WARRANTIES 
                REGARDING THE QUALITY, ACCURACY, OR RELIABILITY OF CONTENT GENERATED BY THESE THIRD-PARTY SERVICES. WE ARE NOT 
                RESPONSIBLE FOR ANY ERRORS, INACCURACIES, OR INAPPROPRIATE CONTENT PRODUCED BY AI SYSTEMS.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED WITHOUT ANY WARRANTY THAT IT WILL MEET 
                YOUR REQUIREMENTS OR THAT IT WILL BE SUITABLE FOR ANY PARTICULAR PURPOSE.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">14.</span>
              Limitation of Liability
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL VOXVID, ITS AFFILIATES, DIRECTORS, 
                  EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY 
                  DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE 
                  LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
                </p>
              </div>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR 
                RELATING TO THESE TERMS OR THE SERVICE, WHETHER IN CONTRACT, TORT, OR OTHERWISE, IS LIMITED TO THE AMOUNT YOU 
                HAVE PAID TO US IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY, OR ONE 
                HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OF THE ABOVE EXCLUSIONS 
                AND LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH JURISDICTIONS, OUR LIABILITY WILL BE LIMITED TO THE GREATEST 
                EXTENT PERMITTED BY LAW.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                YOU ACKNOWLEDGE AND AGREE THAT THE LIMITATIONS OF LIABILITY SET FORTH IN THIS SECTION ARE FUNDAMENTAL ELEMENTS 
                OF THE BASIS OF THE BARGAIN BETWEEN YOU AND US AND THAT THE SERVICE WOULD NOT BE PROVIDED WITHOUT SUCH LIMITATIONS.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">15.</span>
              Indemnification
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You agree to defend, indemnify, and hold harmless VoxVid, its affiliates, licensors, and service providers, 
                and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, 
                successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, 
                expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Your violation of these Terms</li>
                <li>Your use of the Service, including but not limited to your User Content</li>
                <li>Your violation of any law or the rights of a third party</li>
                <li>Any dispute between you and any third party</li>
                <li>Any claim that your User Content caused damage to a third party</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We reserve the right to assume the exclusive defense and control of any matter otherwise subject to 
                indemnification by you, in which event you will cooperate with us in asserting any available defenses.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">16.</span>
              Changes to Terms
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is 
                material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a 
                material change will be determined at our sole discretion.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by 
                the revised terms. If you do not agree to the new terms, you must stop using the Service.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We will notify you of material changes by posting a notice on our website or by sending you an email to the 
                address associated with your account. It is your responsibility to review these Terms periodically for changes.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">17.</span>
              Governing Law
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], 
                United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision 
                of these Terms will not be considered a waiver of those rights.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions 
                of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our 
                Service and supersede and replace any prior agreements we might have had between us regarding the Service.
              </p>
            </div>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">18.</span>
              Dispute Resolution
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                18.1 Informal Resolution
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Before filing a claim, you agree to try to resolve the dispute informally by contacting us at 
                legal@voxvid.com. We will attempt to resolve the dispute informally by contacting you via email. If a 
                dispute is not resolved within 30 days of submission, you or we may bring a formal proceeding.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                18.2 Arbitration Agreement
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You and VoxVid agree that any dispute, claim, or controversy arising out of or relating to these Terms or the 
                breach, termination, enforcement, interpretation, or validity thereof, or the use of the Service (collectively, 
                "Disputes") will be settled by binding arbitration, except that each party retains the right to seek injunctive 
                or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, 
                misappropriation, or violation of a party's copyrights, trademarks, trade secrets, patents, or other intellectual 
                property rights.
              </p>

              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                18.3 Class Action Waiver
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                YOU AND VOXVID AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND 
                NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. Unless both you and 
                VoxVid agree, no arbitrator or judge may consolidate more than one person's claims or otherwise preside over 
                any form of a representative or class proceeding.
              </p>
            </div>
          </section>

          {/* Section 19 */}
          <section id="section-19" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">19.</span>
              Privacy and Data Protection
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and 
                disclose information about you. By using the Service, you agree to our collection, use, and disclosure of 
                your information as described in our Privacy Policy.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) for 
                users in the European Economic Area and the California Consumer Privacy Act (CCPA) for California residents.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you are located in the European Economic Area, you have certain rights under the GDPR, including the right 
                to access, rectify, or erase your personal data, restrict or object to processing, and data portability. To 
                exercise these rights, please contact us at privacy@voxvid.com.
              </p>
            </div>
          </section>

          {/* Section 20 */}
          <section id="section-20" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">20.</span>
              Contact Information
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                <p className="text-white/90" style={{ fontFamily: "GeistMono, monospace" }}>
                  <strong>VoxVid Support Team</strong>
                </p>
                <p className="text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                  Email: legal@voxvid.com<br />
                  Support: support@voxvid.com<br />
                  Address: [Your Company Address]<br />
                  Phone: [Your Phone Number]
                </p>
              </div>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                For general support inquiries, please visit our Help Center or contact us through the support portal in your 
                account dashboard. We aim to respond to all inquiries within 48 business hours.
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-8">
            <div className="flex gap-4">
              <Shield className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "GeistSans, sans-serif" }}>
                  Acknowledgment
                </h3>
                <p className="text-white/80" style={{ fontFamily: "GeistMono, monospace" }}>
                  BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM. 
                  IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SERVICE.
                </p>
                <p className="text-cyan-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  These Terms were last updated on October 31, 2025. We recommend that you print or save a copy of these Terms 
                  for your records.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
            © 2025 VoxVid. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors" style={{ fontFamily: "GeistMono, monospace" }}>
              Terms
            </Link>
            <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors" style={{ fontFamily: "GeistMono, monospace" }}>
              Privacy
            </Link>
            <a href="mailto:support@voxvid.com" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors" style={{ fontFamily: "GeistMono, monospace" }}>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
