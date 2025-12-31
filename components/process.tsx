"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Search, Lightbulb, Code, Rocket } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Process() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "Nuestro",
      accent: "Proceso",
      subtitle: "Un enfoque estructurado para transformar tu visión en realidad",
      steps: [
        {
          icon: Search,
          title: "Análisis",
          description: "Estudiamos tu negocio y datos para identificar oportunidades de mejora con IA.",
        },
        {
          icon: Lightbulb,
          title: "Estrategia",
          description: "Diseñamos una solución personalizada que se adapta a tus necesidades específicas.",
        },
        {
          icon: Code,
          title: "Desarrollo",
          description: "Implementamos la solución con las mejores prácticas y tecnologías de vanguardia.",
        },
        {
          icon: Rocket,
          title: "Despliegue",
          description: "Lanzamos y optimizamos continuamente para garantizar resultados excepcionales.",
        },
      ],
      whyTitle: "¿Por qué elegir Kodata?",
      whyCopy:
        "Combinamos experiencia técnica con comprensión profunda del negocio para entregar soluciones de IA que generan valor real y medible desde el primer día.",
    },
    en: {
      title: "Our",
      accent: "Process",
      subtitle: "A structured approach to turn your vision into reality",
      steps: [
        {
          icon: Search,
          title: "Analysis",
          description: "We study your business and data to spot AI opportunities.",
        },
        {
          icon: Lightbulb,
          title: "Strategy",
          description: "We design a tailored solution for your specific needs.",
        },
        {
          icon: Code,
          title: "Development",
          description: "We implement with best practices and cutting-edge tech.",
        },
        {
          icon: Rocket,
          title: "Launch",
          description: "We release and keep optimizing to deliver standout results.",
        },
      ],
      whyTitle: "Why choose Kodata?",
      whyCopy:
        "We pair technical expertise with business insight to deliver AI solutions that create real, measurable value from day one.",
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
