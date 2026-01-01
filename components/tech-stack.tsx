"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Database, ListChecks, Gauge, Eye, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

const items = [
  { icon: Database, key: "readOnly" },
  { icon: ListChecks, key: "allowlist" },
  { icon: Gauge, key: "limits" },
  { icon: Eye, key: "audit" },
  { icon: Lock, key: "privacy" },
]

export function TechStack() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "Seguridad y",
      accent: "control",
      subtitle: "Hoy soportamos PostgreSQL. Más conectores en camino.",
      note: "Tus datos nunca se usan para entrenar modelos. Guardrails y auditoría para cada consulta.",
      bullets: {
        readOnly: "Conexiones de solo lectura",
        allowlist: "Allowlist por tablas y columnas",
        limits: "Límites de consulta configurables",
        audit: "Audit logs (Pro+)",
        privacy: "Datos no se usan para entrenar modelos",
      },
    },
    en: {
      title: "Security &",
      accent: "control",
      subtitle: "Today we support PostgreSQL. More connectors coming soon.",
      note: "Your data is never used to train models. Guardrails and audit for every query.",
      bullets: {
        readOnly: "Read-only connections",
        allowlist: "Table/column allowlist",
        limits: "Configurable query limits",
        audit: "Audit logs (Pro+)",
        privacy: "Data not used to train models",
      },
    },
  } as const

  const t = copy[language]

  return (
    <section id="tecnologia" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.accent}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <Card className="p-8 md:p-12 bg-card border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/40"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm text-foreground">
                    <div className="font-semibold">{t.bullets[item.key as keyof typeof t.bullets]}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{t.note}</span>
          </div>
        </Card>
      </div>
    </section>
  )
}
