"use client"

import Link from "next/link"
import { ArrowLeft, Home, Shield, Lock, Eye, Database, UserCheck, Globe, AlertCircle, CheckCircle2 } from "lucide-react"

export default function PrivacyPage() {
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
            <Shield className="h-8 w-8 text-cyan-400" />
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
            Privacy Policy
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: "GeistMono, monospace" }}>
            Your privacy is critically important to us. This policy explains how we collect, use, and protect your data.
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
              <Eye className="h-6 w-6 text-cyan-400" />
              Table of Contents
            </h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "1. Introduction",
                "2. Information We Collect",
                "3. How We Use Your Information",
                "4. Legal Basis for Processing",
                "5. Data Sharing and Disclosure",
                "6. Third-Party Services",
                "7. Data Security",
                "8. Data Retention",
                "9. Your Privacy Rights",
                "10. Children's Privacy",
                "11. International Data Transfers",
                "12. California Privacy Rights",
                "13. GDPR Rights",
                "14. Cookies and Tracking",
                "15. Do Not Track Signals",
                "16. Changes to Privacy Policy",
                "17. Data Breach Notification",
                "18. Contact Us"
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
              Introduction
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                VoxVid ("we", "us", "our") is committed to protecting your privacy and ensuring the security of your personal 
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you use our AI-powered video creation service (the "Service").
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by 
                this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use 
                the Service.
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 flex gap-3">
                <Shield className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-cyan-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  <strong>Our Commitment:</strong> We are committed to transparency in our data practices and comply with 
                  applicable data protection laws, including GDPR, CCPA, and other privacy regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">2.</span>
              Information We Collect
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                2.1 Information You Provide
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We collect information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Register for an account:</strong> Name, email address, password, and profile information</li>
                <li><strong>Create videos:</strong> Scripts, text content, images, audio files, and video project metadata</li>
                <li><strong>Make payments:</strong> Billing information, payment card details (processed securely by third-party 
                    payment processors)</li>
                <li><strong>Contact us:</strong> Email address, name, and any information you include in your communications</li>
                <li><strong>Participate in surveys or promotions:</strong> Responses, feedback, and demographic information</li>
                <li><strong>Use interactive features:</strong> Comments, ratings, and other user-generated content</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                2.2 Automatically Collected Information
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                When you access or use the Service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, 
                    unique device identifiers</li>
                <li><strong>Usage Information:</strong> Pages viewed, features used, time spent on pages, videos created, 
                    actions taken</li>
                <li><strong>Log Data:</strong> Access times, error logs, performance data, API calls</li>
                <li><strong>Location Information:</strong> Approximate geographic location based on IP address</li>
                <li><strong>Cookie Data:</strong> Information collected through cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                2.3 Information from Third Parties
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We may receive information about you from third parties, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Authentication Services:</strong> If you sign in through third-party services (e.g., Google, 
                    Microsoft), we receive basic profile information</li>
                <li><strong>Payment Processors:</strong> Payment verification and transaction data</li>
                <li><strong>Analytics Providers:</strong> Aggregated usage statistics and performance metrics</li>
                <li><strong>AI Service Providers:</strong> Processing results and service usage metadata</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                2.4 Content You Create
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                The Service allows you to create and store videos using AI technology. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Text scripts and written content</li>
                <li>Images and avatar photos you upload</li>
                <li>Audio recordings or uploaded audio files</li>
                <li>Generated videos and associated metadata</li>
                <li>Voice selections and customization preferences</li>
                <li>Project names and organizational information</li>
              </ul>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 flex gap-3 mt-4">
                <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-orange-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  <strong>Important:</strong> Content you create may be processed by third-party AI providers (such as D-ID, 
                  ElevenLabs, etc.) to generate videos. While we use secure connections and trusted providers, please do not 
                  upload sensitive personal information or confidential content that you do not want processed by AI systems.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">3.</span>
              How We Use Your Information
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We use the information we collect for the following purposes:
              </p>
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                3.1 Service Provision and Improvement
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Create, maintain, and manage your account</li>
                <li>Process your video creation requests and deliver generated content</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Monitor and improve Service performance, reliability, and user experience</li>
                <li>Develop new features and functionality</li>
                <li>Troubleshoot technical issues and optimize performance</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                3.2 Communication
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Send transactional emails (account verification, password resets, payment confirmations)</li>
                <li>Provide Service updates, announcements, and security alerts</li>
                <li>Send marketing communications (with your consent, and you may opt out at any time)</li>
                <li>Respond to your comments, questions, and requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                3.3 Payment Processing
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Process payments and manage subscriptions</li>
                <li>Detect and prevent fraudulent transactions</li>
                <li>Issue invoices and maintain billing records</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                3.4 Security and Compliance
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Protect against unauthorized access, fraud, and abuse</li>
                <li>Enforce our Terms of Service and other policies</li>
                <li>Comply with legal obligations and regulatory requirements</li>
                <li>Investigate and prevent violations of our policies</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                3.5 Analytics and Research
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Analyze usage patterns and user behavior</li>
                <li>Conduct market research and statistical analysis</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
                <li>Generate anonymized and aggregated insights</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">4.</span>
              Legal Basis for Processing (GDPR)
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we process your 
                personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you requested and 
                    fulfill our contractual obligations</li>
                <li><strong>Consent:</strong> You have given explicit consent for specific processing activities (e.g., 
                    marketing communications)</li>
                <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests (e.g., 
                    fraud prevention, security, service improvement) that do not override your rights</li>
                <li><strong>Legal Obligation:</strong> Processing required to comply with applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">5.</span>
              Data Sharing and Disclosure
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.1 Service Providers
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We share information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>AI Service Providers:</strong> D-ID, Amazon Polly, Microsoft Azure, ElevenLabs, Google Cloud, 
                    PlayHT for video generation and voice synthesis</li>
                <li><strong>Cloud Storage:</strong> Google Cloud Platform for storing your content and data</li>
                <li><strong>Payment Processors:</strong> Stripe, PayPal, or other payment gateways for processing transactions</li>
                <li><strong>Analytics Providers:</strong> Google Analytics and similar services for usage analysis</li>
                <li><strong>Email Services:</strong> SendGrid, Mailgun, or similar services for sending emails</li>
                <li><strong>Customer Support:</strong> Zendesk, Intercom, or similar platforms for support ticket management</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.2 Business Transfers
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If we are involved in a merger, acquisition, reorganization, or sale of assets, your information may be 
                transferred as part of that transaction. We will notify you of any such change and provide choices regarding 
                your information.
              </p>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.3 Legal Requirements
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We may disclose your information if required to do so by law or in response to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Valid legal processes (subpoenas, court orders, warrants)</li>
                <li>Government or regulatory requests</li>
                <li>Protection of our rights, property, or safety, or that of others</li>
                <li>Enforcement of our Terms of Service</li>
                <li>Investigation of potential fraud or security issues</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mt-6" style={{ fontFamily: "GeistSans, sans-serif" }}>
                5.4 With Your Consent
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We may share information with third parties when you explicitly consent to such sharing.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">6.</span>
              Third-Party Services
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                The Service integrates with various third-party AI and cloud services to provide functionality. When you use 
                these features, your content may be transmitted to and processed by these third-party providers. We carefully 
                select service providers that maintain appropriate security and privacy standards.
              </p>
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                Key Third-Party Services:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>D-ID:</strong> Video generation and avatar animation</li>
                <li><strong>Voice Providers:</strong> Amazon Polly, Microsoft Azure Speech, ElevenLabs, Google Cloud 
                    Text-to-Speech, PlayHT</li>
                <li><strong>AI Enhancement:</strong> OpenAI or similar AI models for script enhancement</li>
                <li><strong>Google Cloud Platform:</strong> Storage and infrastructure</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                These third-party services have their own privacy policies. We encourage you to review their privacy practices. 
                We are not responsible for the privacy practices of these third parties.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">7.</span>
              Data Security
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Encryption:</strong> Data in transit is encrypted using TLS/SSL protocols; sensitive data at rest 
                    is encrypted</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms limit who can 
                    access your data</li>
                <li><strong>Regular Security Audits:</strong> Periodic security assessments and vulnerability scans</li>
                <li><strong>Secure Infrastructure:</strong> Data stored on secure cloud platforms with industry-standard 
                    security practices</li>
                <li><strong>Employee Training:</strong> Staff trained on data security and privacy best practices</li>
                <li><strong>Incident Response:</strong> Established procedures for detecting and responding to security incidents</li>
              </ul>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 flex gap-3 mt-4">
                <Lock className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-orange-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  <strong>Important:</strong> While we implement robust security measures, no method of transmission over the 
                  Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information. 
                  You are responsible for maintaining the security of your account credentials.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">8.</span>
              Data Retention
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Provide the Service and fulfill our contractual obligations</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Maintain business records and analytics</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Specific retention periods:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Account Information:</strong> Retained while your account is active, plus up to 90 days after 
                    account deletion</li>
                <li><strong>Content (Videos, Scripts, Images):</strong> Retained while your account is active; you can delete 
                    content at any time</li>
                <li><strong>Transaction Records:</strong> Retained for 7 years for tax and accounting purposes</li>
                <li><strong>Log Data:</strong> Typically retained for 90-180 days</li>
                <li><strong>Marketing Data:</strong> Retained until you opt out or withdraw consent</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                After the retention period, we securely delete or anonymize your personal information.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">9.</span>
              Your Privacy Rights
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Objection:</strong> Object to processing of your personal information for certain purposes</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for processing based on consent (doesn't affect 
                    processing that occurred before withdrawal)</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                To exercise these rights, please contact us at privacy@voxvid.com. We will respond to your request within 
                30 days. You can also manage many aspects of your data through your account settings.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">10.</span>
              Children's Privacy
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                The Service is not intended for children under the age of 18 (or the applicable age of majority in your 
                jurisdiction). We do not knowingly collect personal information from children under 18.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If we become aware that we have collected personal information from a child under 18 without parental consent, 
                we will take steps to delete that information as soon as possible. If you believe we have collected information 
                from a child, please contact us immediately at privacy@voxvid.com.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">11.</span>
              International Data Transfers
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Your information may be transferred to and processed in countries other than your country of residence. These 
                countries may have data protection laws that differ from those in your country.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                When we transfer personal information from the EEA, UK, or Switzerland to other countries, we ensure appropriate 
                safeguards are in place, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>EU-U.S. Privacy Shield certification (where applicable)</li>
                <li>Other legally approved transfer mechanisms</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">12.</span>
              California Privacy Rights (CCPA)
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal 
                    information we have collected about you</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information (subject to exceptions)</li>
                <li><strong>Right to Opt-Out:</strong> Opt out of the "sale" of your personal information (we do not sell 
                    personal information)</li>
                <li><strong>Right to Non-Discrimination:</strong> Not receive discriminatory treatment for exercising your 
                    privacy rights</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                To exercise these rights, email us at privacy@voxvid.com or call us at [phone number]. We will verify your 
                identity before processing your request.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                In the past 12 months, we have collected the following categories of personal information: identifiers, 
                commercial information, internet/network activity, geolocation data, and inferences. We use this information 
                for the purposes described in Section 3.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">13.</span>
              GDPR Rights (European Users)
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you are located in the European Economic Area, United Kingdom, or Switzerland, you have rights under the 
                General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision-making and profiling</li>
                <li>Right to withdraw consent</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                To exercise any of these rights, please contact us at privacy@voxvid.com. You also have the right to lodge a 
                complaint with your local data protection authority.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">14.</span>
              Cookies and Tracking Technologies
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We use cookies and similar tracking technologies to collect information about your browsing activities. 
                Cookies are small text files stored on your device.
              </p>
              <h3 className="text-xl font-semibold text-white/90" style={{ fontFamily: "GeistSans, sans-serif" }}>
                Types of Cookies We Use:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li><strong>Essential Cookies:</strong> Necessary for the Service to function properly (e.g., authentication, 
                    session management)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service (e.g., Google 
                    Analytics)</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Track your activity for advertising purposes (only with your consent)</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you 
                when cookies are being sent. However, some features of the Service may not function properly without cookies.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">15.</span>
              Do Not Track Signals
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Some web browsers have a "Do Not Track" feature that signals to websites that you do not want your online 
                activities tracked. Currently, there is no uniform standard for recognizing and implementing Do Not Track 
                signals. As such, we do not currently respond to Do Not Track signals.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">16.</span>
              Changes to This Privacy Policy
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
                requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Posting the updated Privacy Policy on our website with a new "Last Updated" date</li>
                <li>Sending you an email notification (for material changes)</li>
                <li>Displaying a prominent notice on the Service</li>
              </ul>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                Your continued use of the Service after the effective date of the updated Privacy Policy constitutes your 
                acceptance of the changes. If you do not agree with the updated Privacy Policy, you must stop using the Service.
              </p>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your 
                information.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">17.</span>
              Data Breach Notification
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                In the event of a data breach that affects your personal information, we will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                <li>Notify you without undue delay (within 72 hours where required by law)</li>
                <li>Describe the nature of the breach and the data affected</li>
                <li>Provide information about the likely consequences of the breach</li>
                <li>Describe the measures we are taking to address the breach</li>
                <li>Provide recommendations for steps you can take to protect yourself</li>
                <li>Notify relevant supervisory authorities as required by law</li>
              </ul>
            </div>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "GeistSans, sans-serif" }}>
              <span className="text-cyan-400">18.</span>
              Contact Us
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please 
                contact us:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                <p className="text-white/90" style={{ fontFamily: "GeistMono, monospace" }}>
                  <strong>VoxVid Data Protection Officer</strong>
                </p>
                <p className="text-white/70" style={{ fontFamily: "GeistMono, monospace" }}>
                  Email: privacy@voxvid.com<br />
                  GDPR Inquiries: gdpr@voxvid.com<br />
                  CCPA Inquiries: ccpa@voxvid.com<br />
                  General Support: support@voxvid.com<br />
                  Address: [Your Company Address]<br />
                  Phone: [Your Phone Number]
                </p>
              </div>
              <p className="text-white/80 leading-relaxed" style={{ fontFamily: "GeistMono, monospace" }}>
                We will respond to all requests within 30 days. For urgent privacy concerns, please mark your email as 
                "URGENT: Privacy Request" in the subject line.
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-8">
            <div className="flex gap-4">
              <UserCheck className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "GeistSans, sans-serif" }}>
                  Your Consent
                </h3>
                <p className="text-white/80" style={{ fontFamily: "GeistMono, monospace" }}>
                  BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY AND AGREE TO THE 
                  COLLECTION, USE, AND DISCLOSURE OF YOUR INFORMATION AS DESCRIBED HEREIN.
                </p>
                <p className="text-cyan-200 text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                  This Privacy Policy was last updated on October 31, 2025. We recommend that you print or save a copy of this 
                  Privacy Policy for your records.
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
