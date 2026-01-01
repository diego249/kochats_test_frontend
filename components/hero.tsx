"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Hero() {
  const { language } = useLanguage()

  const copy = {
    es: {
      badge: "Plataforma de agentes IA",
      headingPrefix: "Lanza tus propios",
      headingHighlight: "bots conectados a tus datos",
      subtitle:
        "Crea y despliega agentes que entienden tu negocio. Conecta bases de datos y herramientas, define flujos y obtén respuestas accionables en minutos.",
      primaryCta: "Crear un agente",
      secondaryCta: "Ver cómo funciona",
      stats: [
        { value: "5 min", label: "para publicar" },
        { value: "Integrado", label: "con tus datos" },
        { value: "Control", label: "roles y guardrails" },
        { value: "Omnicanal", label: "web, chat, API" },
      ],
    },
    en: {
      badge: "AI agent platform",
      headingPrefix: "Launch your own",
      headingHighlight: "bots on top of your data",
      subtitle:
        "Let your team build and ship agents that know your business. Connect databases and tools, design flows, and deliver actionable answers in minutes.",
      primaryCta: "Start building",
      secondaryCta: "See how it works",
      stats: [
        { value: "5 min", label: "to publish" },
        { value: "Integrated", label: "with your data" },
        { value: "Control", label: "roles and guardrails" },
        { value: "Omnichannel", label: "web, chat, API" },
      ],
    },
  } as const

  const t = copy[language]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-glow-pulse"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles size={16} />
            <span>{t.badge}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
        >
          {t.headingPrefix}{" "}
          <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
            {t.headingHighlight}
          </span>
        </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            {t.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground group">
              <a href="/login" className="flex items-center gap-2">
                {t.primaryCta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border hover:bg-muted bg-transparent">
              <a href="#agentes">{t.secondaryCta}</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {t.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
