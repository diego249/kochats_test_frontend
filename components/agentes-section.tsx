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
      heading: "Diseña agentes",
      headingAccent: "sobre tus datos",
      description:
        "Plataforma low-code para que cualquier equipo configure bots con la información de tu empresa. Usa plantillas, conecta bases y APIs, y publícalos en minutos.",
      botTypes: [
        {
          icon: MessageSquare,
          title: "Soporte automatizado",
          description: "Responde con contexto desde tu base de conocimiento, tickets y CRM.",
          features: ["Sincroniza help desk y documentos", "Respuestas citadas en tus fuentes", "Escalamiento a humano con contexto"],
        },
        {
          icon: Package,
          title: "Operaciones y logística",
          description: "Orquesta procesos y crea órdenes conectado a ERP e inventario.",
          features: ["Flujos con aprobaciones", "Actualización en tiempo real", "Alertas y recordatorios"],
        },
        {
          icon: ShoppingCart,
          title: "Copiloto de ventas",
          description: "Acompaña al equipo con pricing, catálogo y CRM en un solo bot.",
          features: ["Conecta CRM y catálogos", "Genera propuestas y resúmenes", "Registra notas y tareas"],
        },
        {
          icon: BarChart3,
          title: "Analista de datos",
          description: "Consulta métricas sobre tus bases y dashboards sin escribir SQL.",
          features: ["Conecta SQL y warehouses", "Plantillas de preguntas recurrentes", "Reportes accionables en chat o email"],
        },
      ],
      benefitsTitle: "Beneficios de la",
      benefitsAccent: "plataforma",
      benefits: [
        {
          icon: Zap,
          title: "Conectores listos",
          description: "Integra bases de datos, APIs y SaaS sin código.",
        },
        {
          icon: Shield,
          title: "Gobernanza empresarial",
          description: "Roles, aprobaciones y trazabilidad en cada agente.",
        },
        {
          icon: Clock,
          title: "Itera en minutos",
          description: "Publica cambios sin depender de ciclos de desarrollo.",
        },
        {
          icon: BarChart3,
          title: "Analytics en vivo",
          description: "Observa uso, gaps y mejora prompts con datos reales.",
        },
      ],
    },
    en: {
      badge: "Platform",
      heading: "Design agents",
      headingAccent: "on your data",
      description:
        "Low-code platform so any team can configure bots with your company data. Use templates, connect databases and APIs, and ship in minutes.",
      botTypes: [
        {
          icon: MessageSquare,
          title: "Automated support",
          description: "Answer with context from your knowledge base, tickets, and CRM.",
          features: ["Sync help desk and documents", "Cited answers from your sources", "Human handoff with full context"],
        },
        {
          icon: Package,
          title: "Operations and logistics",
          description: "Orchestrate processes and create orders connected to ERP and inventory.",
          features: ["Flows with approvals", "Real-time updates", "Alerts and reminders"],
        },
        {
          icon: ShoppingCart,
          title: "Sales copilot",
          description: "Equip the team with pricing, catalog, and CRM in one bot.",
          features: ["Connect CRM and catalogs", "Generate proposals and summaries", "Log notes and tasks"],
        },
        {
          icon: BarChart3,
          title: "Data analyst",
          description: "Query metrics from your databases and dashboards without SQL.",
          features: ["Connect SQL and warehouses", "Templates for recurring questions", "Actionable reports in chat or email"],
        },
      ],
      benefitsTitle: "Platform",
      benefitsAccent: "benefits",
      benefits: [
        {
          icon: Zap,
          title: "Connectors included",
          description: "Integrate databases, APIs, and SaaS without code.",
        },
        {
          icon: Shield,
          title: "Enterprise governance",
          description: "Roles, approvals, and traceability per agent.",
        },
        {
          icon: Clock,
          title: "Iterate in minutes",
          description: "Ship changes without waiting on dev cycles.",
        },
        {
          icon: BarChart3,
          title: "Live analytics",
          description: "See usage, gaps, and improve prompts with real data.",
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
