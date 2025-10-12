"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "How does VoxVid create videos from text?",
    answer: (
      <>
        VoxVid uses advanced AI to convert your scripts into professional videos.
        <br />
        <br />
        Our AI analyzes your text, generates appropriate visuals, selects natural voice acting, and creates smooth video transitions — all automatically.
      </>
    ),
  },
  {
    question: "Is it free?",
    answer: (
      <>
        Yes — there's a generous free tier to get started.
        <br />
        <br />
        Pro and Business plans unlock unlimited generations, custom avatars, and premium voice options.
      </>
    ),
  },
  {
    question: "Can I use my own voice or avatar?",
    answer: (
      <>
        Absolutely! Upload your own voice recordings or create custom avatars.
        <br />
        <br />
        Pro users can also request specific voice styles or avatar designs tailored to their brand.
      </>
    ),
  },
  {
    question: "Where are my videos stored?",
    answer: (
      <>
        Your videos are stored securely in the cloud with <strong>enterprise-grade encryption</strong>.
        <br />
        <br />
        You can download, share, or embed them anywhere. We never use your content for training our AI models.
      </>
    ),
  },
  {
    question: "How does VoxVid ensure video quality?",
    answer: (
      <>
        VoxVid uses state-of-the-art AI models from leading providers like <strong>OpenAI</strong> and <strong>ElevenLabs</strong>.
        <br />
        <br />
        Videos are rendered in high definition with natural lip-sync, professional audio quality, and cinematic effects.
      </>
    ),
  },
  {
    question: "Can I edit videos after generation?",
    answer: (
      <>
        Yes — edit scripts, change voices, swap avatars, or adjust timing.
        <br />
        <br />
        Each generation saves as a new version, so you can experiment without losing previous work.
      </>
    ),
  },
]

interface FAQSectionProps {
}

export default function FAQSection({ }: FAQSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2
          className="text-center mb-12 md:mb-16 font-semibold"
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
          Frequently Asked (and Silently Wondered) Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/10 rounded-lg bg-white/5 overflow-hidden"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <span
                  className="text-left font-medium text-white"
                  style={{
                    fontFamily: 'var(--font-geist-sans), "GeistSans", sans-serif',
                    fontSize: "18px",
                  }}
                >
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 pt-0">
                <p
                  className="text-white/80"
                  style={{
                    fontFamily:
                      'GeistMono, ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
                    fontSize: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Call to action */}
        <div className="mt-12 md:mt-16 text-center">
          <p
            className="text-white/80 mb-6"
            style={{
              fontFamily:
                'GeistMono, ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            Still unsure? Try it for 60 seconds — you'll never create videos the old way again.
          </p>
        </div>
      </div>
    </section>
  )
}
