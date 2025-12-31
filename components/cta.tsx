"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function CTA() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "¿Listo para transformar tu empresa con",
      accent: "Inteligencia Artificial?",
      subtitle: "Contáctanos hoy y descubre cómo podemos ayudarte a convertirte en una verdadera Data Driven Company.",
      cta: "Ir al login",
      badges: ["Respuesta en 24h", "Consulta gratuita", "Sin compromiso"],
    },
    en: {
      title: "Ready to transform your company with",
      accent: "Artificial Intelligence?",
      subtitle: "Reach out today and discover how we can help you become a true Data Driven Company.",
      cta: "Go to login",
      badges: ["Response within 24h", "Free consultation", "No commitment"],
    },
  } as const

  const t = copy[language]

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.accent}</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground group text-lg px-8 py-6"
            >
              <a href="/login" className="flex items-center gap-2">
                <Mail size={20} />
                {t.cta}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            {[t.badges[0], t.badges[1], t.badges[2]].map((badge, idx) => (
              <div key={badge} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${idx === 1 ? "bg-secondary" : "bg-primary"}`} />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
