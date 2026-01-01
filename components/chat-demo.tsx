"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Bot, User } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function ChatDemo() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "Demo de",
      accent: "asistente",
      subtitle: "Preguntas a tu base de datos en lenguaje natural",
      messages: [
        {
          type: "user",
          message: "¿Cuánto facturamos este mes y cómo se compara con el mes pasado?",
        },
        {
          type: "bot",
          message:
            "Total: 128,430. Variación vs mes pasado: +7.2%. Principales drivers: categoría A, tienda B. ¿Querés un breakdown?",
        },
        {
          type: "user",
          message: "¿Hay pedidos pendientes con pagos parciales?",
        },
      ],
    },
    en: {
      title: "Assistant",
      accent: "demo",
      subtitle: "Ask your database in plain language",
      messages: [
        {
          type: "user",
          message: "How much did we bill this month and how does it compare to last month?",
        },
        {
          type: "bot",
          message:
            "Total: 128,430. Change vs last month: +7.2%. Main drivers: category A, store B. Want a breakdown?",
        },
        {
          type: "user",
          message: "Are there orders with partial payments pending?",
        },
      ],
    },
  } as const

  const t = copy[language]

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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

        <div className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-8 bg-card border-border">
            <div className="space-y-6">
              {t.messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.type === "user" ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                  className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.type === "user"
                        ? "bg-gradient-to-br from-secondary to-cyan-400"
                        : "bg-gradient-to-br from-primary to-purple-400"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <User size={20} className="text-white" />
                    ) : (
                      <Bot size={20} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 p-4 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-secondary/10 border border-secondary/20"
                        : "bg-primary/10 border border-primary/20"
                    }`}
                  >
                    <p className="text-sm text-foreground leading-relaxed">{msg.message}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: t.messages.length * 0.3 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
