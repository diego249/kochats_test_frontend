"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Database, Layers, ShieldCheck, Rocket } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Process() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "Cómo funciona",
      accent: "la plataforma",
      subtitle: "Enciende asistentes sobre tus datos sin proyectos a medida",
      steps: [
        {
          icon: Database,
          title: "Conecta datos (SQL)",
          description: "Acceso read-only y allowlist de tablas y columnas.",
        },
        {
          icon: Layers,
          title: "Define instrucciones y plantillas",
          description: "Plantillas listas para preguntas de negocio.",
        },
        {
          icon: ShieldCheck,
          title: "Permisos, límites y auditoría",
          description: "Guardrails de SQL seguro con registros.",
        },
        {
          icon: Rocket,
          title: "Despliega y mejora",
          description: "Úsalo con tu equipo y mejora con métricas.",
        },
      ],
      whyTitle: "Hecho para equipos que necesitan respuestas rápidas",
      whyCopy: "Crea asistentes sobre tus propios datos, con control y trazabilidad.",
    },
    en: {
      title: "How the platform",
      accent: "works",
      subtitle: "Light up assistants on your data without custom projects",
      steps: [
        {
          icon: Database,
          title: "Connect data (SQL)",
          description: "Read-only access with table/column allowlist.",
        },
        {
          icon: Layers,
          title: "Define instructions and templates",
          description: "Ready-made templates for business questions.",
        },
        {
          icon: ShieldCheck,
          title: "Permissions, limits, audit",
          description: "SQL guardrails with audit logging.",
        },
        {
          icon: Rocket,
          title: "Deploy and improve",
          description: "Use with your team and iterate with metrics.",
        },
      ],
      whyTitle: "Built for teams that need fast answers",
      whyCopy: "Build assistants on your own data with control and traceability.",
    },
  } as const

  const t = copy[language]

  return (
    <section id="proceso" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.accent}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group h-full relative">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {index + 1}
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">{t.whyTitle}</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.whyCopy}</p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
