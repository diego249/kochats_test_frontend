"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  Bot,
  ShoppingCart,
  Package,
  MessageSquare,
  Zap,
  Shield,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function AgentesSection() {
  const { language } = useLanguage()

  const copy = {
    es: {
      badge: "Plataforma",
      heading: "Diseña asistentes",
      headingAccent: "sobre tus datos",
      description:
        "Plataforma low-code para crear asistentes que consultan tus datos con permisos y límites. Usa plantillas, conecta bases de datos, y publícalos rápidamente.",
      botTypes: [
        {
          icon: MessageSquare,
          title: "Analista de datos",
          description: "Responde preguntas sobre tu base sin escribir SQL, con resultados y trazabilidad.",
          features: [
            "Templates de preguntas recurrentes",
            "Resultados con evidencia (tablas/IDs)",
            "Export (Pro+)",
          ],
        },
        {
          icon: Package,
          title: "Operaciones y logística",
          description: "Consulta estado, métricas y excepciones conectadas a tu ERP/inventario.",
          features: ["Consultas seguras a tablas permitidas", "Resúmenes accionables", "Alertas (próximamente)"],
        },
        {
          icon: ShoppingCart,
          title: "Copiloto de ventas",
          description: "Accede a pricing, catálogo y clientes desde un solo chat.",
          features: ["Conecta CRM y catálogos", "Respuestas citadas en tus fuentes", "Notas rápidas y pendientes"],
        },
        {
          icon: BarChart3,
          title: "Otros casos",
          description: "Plantillas para preguntas recurrentes sobre tus datos con guardrails.",
          features: ["Conecta SQL y warehouses", "Plantillas editables", "Reportes accionables en chat o email"],
        },
      ],
      benefitsTitle: "Beneficios de la",
      benefitsAccent: "plataforma",
      benefits: [
        {
          icon: Zap,
          title: "Conectores para datos",
          description: "Bases de datos y más en camino.",
        },
        {
          icon: Shield,
          title: "Permisos y auditoría",
          description: "Control por tablas/columnas y registro de consultas.",
        },
        {
          icon: Clock,
          title: "Itera en minutos",
          description: "Refina prompts y reglas sin despliegues.",
        },
        {
          icon: BarChart3,
          title: "Métricas de uso y calidad",
          description: "Uso, consultas y fallos visibles para mejorar.",
        },
      ],
    },
    en: {
      badge: "Platform",
      heading: "Design assistants",
      headingAccent: "on your data",
      description:
        "Low-code platform to build assistants that query your data with permissions and limits. Use templates, connect databases and ship quickly.",
      botTypes: [
        {
          icon: MessageSquare,
          title: "Data analyst",
          description: "Answer questions on your database without SQL, with results and traceability.",
          features: [
            "Templates for recurring questions",
            "Results with evidence (tables/IDs)",
            "Export (Pro+)",
          ],
        },
        {
          icon: Package,
          title: "Operations and logistics",
          description: "Check status, metrics, and exceptions from your ERP/inventory.",
          features: ["Safe queries to allowed tables", "Actionable summaries", "Alerts (coming soon)"],
        },
        {
          icon: ShoppingCart,
          title: "Sales copilot",
          description: "Access pricing, catalog, and customers from a single chat.",
          features: ["Connect CRM and catalogs", "Cited answers from your sources", "Quick notes and todos"],
        },
        {
          icon: BarChart3,
          title: "Other templates",
          description: "Templates for recurring questions on your data with guardrails.",
          features: ["Connect SQL and warehouses", "Editable templates", "Actionable reports in chat or email"],
        },
      ],
      benefitsTitle: "Platform",
      benefitsAccent: "benefits",
      benefits: [
        {
          icon: Zap,
          title: "Connectors for data",
          description: "Databases and more on the way.",
        },
        {
          icon: Shield,
          title: "Permissions and audit",
          description: "Table/column control with query logging.",
        },
        {
          icon: Clock,
          title: "Iterate in minutes",
          description: "Tune prompts and rules without deploys.",
        },
        {
          icon: BarChart3,
          title: "Usage and quality metrics",
          description: "See usage, queries, and failures to improve.",
        },
      ],
    },
  } as const

  const t = copy[language]

  return (
    <>
      {/* Main Section */}
      <section id="agentes" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Bot size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">{t.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
              {t.heading}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.headingAccent}</span>
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              {t.description}
            </p>
          </motion.div>

          {/* Bot Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
            {t.botTypes.map((bot, index) => {
              const Icon = bot.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">{bot.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{bot.description}</p>
                    <ul className="space-y-2">
                      {bot.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              {t.benefitsTitle}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.benefitsAccent}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-card border-border h-full text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-cyan-400 flex items-center justify-center mb-4 mx-auto">
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
