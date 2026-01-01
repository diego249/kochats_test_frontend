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
      subtitle: "Enciende bots sobre tus datos sin proyectos a medida",
      steps: [
        {
          icon: Database,
          title: "Conecta tus datos",
          description: "Integra bases SQL, documentos, APIs y CRM en un solo lugar.",
        },
        {
          icon: Layers,
          title: "Diseña el agente",
          description: "Elige plantillas o crea flujos con instrucciones, acciones y tono.",
        },
        {
          icon: ShieldCheck,
          title: "Define guardrails",
          description: "Permisos, auditoría y límites para proteger tu información.",
        },
        {
          icon: Rocket,
          title: "Despliega y mejora",
          description: "Publica en web, chat o API y mejora con analíticas en vivo.",
        },
      ],
      whyTitle: "Una plataforma para equipos",
      whyCopy:
        "Producto y operaciones pueden lanzar bots sobre sus propios datos sin depender de sprints de desarrollo. Seguridad, versionado y monitoreo incluidos.",
    },
    en: {
      title: "How the platform",
      accent: "works",
      subtitle: "Light up bots on your data without custom projects",
      steps: [
        {
          icon: Database,
          title: "Connect your data",
          description: "Plug SQL, documents, APIs, and CRMs into one place.",
        },
        {
          icon: Layers,
          title: "Design the agent",
          description: "Pick templates or craft flows with instructions, actions, and tone.",
        },
        {
          icon: ShieldCheck,
          title: "Set guardrails",
          description: "Permissions, audit trails, and limits keep your data safe.",
        },
        {
          icon: Rocket,
          title: "Deploy and improve",
          description: "Ship to web, chat, or API and iterate with live analytics.",
        },
      ],
      whyTitle: "Built for teams",
      whyCopy:
        "Product and ops teams can launch bots on their own data without waiting for dev sprints. Security, versioning, and monitoring come out of the box.",
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
