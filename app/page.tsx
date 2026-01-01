import { AgentesSection } from "@/components/agentes-section"
import { CTA } from "@/components/cta"
import { ChatDemo } from "@/components/chat-demo"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Process } from "@/components/process"
import { PricingSection } from "@/components/pricing-section"
import { TechStack } from "@/components/tech-stack"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <AgentesSection />
      <ChatDemo />
      <Process />
      <TechStack />
      <PricingSection />
      <CTA />
      <Footer />
    </main>
  )
}
