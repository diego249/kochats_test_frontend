"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  Bot,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  Zap,
  Shield,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react"

const botTypes = [
  {
    icon: ShoppingCart,
    title: "Bot de Ventas",
    description: "Automatiza el proceso de ventas, desde la prospección hasta el cierre de negocios.",
    features: ["Calificación de leads", "Seguimiento automático", "Propuestas personalizadas"],
  },
  {
    icon: Package,
    title: "Bot de Gestión de Pedidos",
    description: "Procesa pedidos, gestiona inventario y coordina entregas de forma autónoma.",
    features: ["Procesamiento 24/7", "Actualización de stock", "Notificaciones automáticas"],
  },
  {
    icon: Users,
    title: "Asistente de Gestión",
    description: "Ayuda en tareas administrativas, programación y coordinación de equipos.",
    features: ["Gestión de agenda", "Coordinación de reuniones", "Reportes automáticos"],
  },
  {
    icon: MessageSquare,
    title: "Bot de Atención al Cliente",
    description: "Responde consultas, resuelve problemas y escala casos complejos cuando es necesario.",
    features: ["Respuestas instantáneas", "Soporte multicanal", "Aprendizaje continuo"],
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Automatización Inteligente",
    description: "Reduce tareas repetitivas y libera tiempo para actividades estratégicas.",
  },
  {
    icon: Clock,
    title: "Disponibilidad 24/7",
    description: "Tus agentes trabajan sin descanso, atendiendo necesidades en cualquier momento.",
  },
  {
    icon: Shield,
    title: "Seguridad y Privacidad",
    description: "Protección de datos empresariales con los más altos estándares de seguridad.",
  },
  {
    icon: BarChart3,
    title: "Mejora Continua",
    description: "Los agentes aprenden de cada interacción para optimizar su rendimiento.",
  },
]

export function AgentesSection() {
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
              <span className="text-sm font-medium text-primary">Producto Principal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
              Agentes Inteligentes{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                para tu Empresa
              </span>
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Crea bots especializados que trabajan con la información de tu empresa, automatizando procesos y actuando
              como asistentes reales en ventas, gestión, atención al cliente y más.
            </p>
          </motion.div>

          {/* Bot Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
            {botTypes.map((bot, index) => {
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
              Beneficios de los{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Agentes Inteligentes
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
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
