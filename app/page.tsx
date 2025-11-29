import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { DifferentSection } from "@/components/landing/different-section"
import { EmailCaptureSection } from "@/components/landing/email-capture-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { SeeItInActionSection } from "@/components/landing/see-it-in-action-section"
import { ScrollReveal } from "@/components/common/ScrollReveal"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ScrollReveal>
          <FeaturesSection />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <SeeItInActionSection />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <HowItWorksSection />
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <DifferentSection />
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <EmailCaptureSection />
        </ScrollReveal>
        <ScrollReveal delay={500}>
          <PricingSection />
        </ScrollReveal>
        <ScrollReveal delay={600}>
          <FAQSection />
        </ScrollReveal>
        <ScrollReveal delay={700}>
          <CTASection />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}
