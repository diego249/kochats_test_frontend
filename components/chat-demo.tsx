"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Bot, User } from "lucide-react"

const chatMessages = [
  {
    type: "user",
    message: "¿Cuál es el estado del inventario de productos electrónicos?",
  },
  {
    type: "bot",
    message:
      "Actualmente tenemos 1,247 unidades en stock. Los productos más vendidos son laptops (342 unidades) y smartphones (589 unidades). Te recomiendo reabastecer tablets, quedan solo 45 unidades.",
  },
  {
    type: "user",
    message: "Genera un reporte de ventas del último trimestre",
  },
]

export function ChatDemo() {
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
            Interacción{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              en Tiempo Real
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Así es como tus agentes inteligentes interactúan con tu equipo
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-8 bg-card border-border">
            <div className="space-y-6">
              {chatMessages.map((msg, index) => (
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
                transition={{ duration: 0.5, delay: chatMessages.length * 0.3 }}
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
