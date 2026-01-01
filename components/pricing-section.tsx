"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, BadgeCheck, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { planCatalog } from "@/lib/plan-catalog"

export function PricingSection() {
  const { language } = useLanguage()

  const copy = {
    es: {
      badge: "Planes y precios",
      heading: "Elige el plan que se ajusta a tu equipo",
      subtitle: "Planes listos para empezar gratis y escalar cuando necesites más capacidad.",
      cta: "Crear cuenta",
      contact: "Hablar con ventas",
      tableTitle: "Comparativa rápida",
      perMonth: "al mes",
      highlight: "Mejor para crecer",
      labels: {
        plan: "Plan",
        price: "Precio",
        questions: "Preguntas",
        users: "Usuarios",
        datasources: "Datasources",
      },
      limitsNote: "Los límites se aplican automáticamente según el plan",
    },
    en: {
      badge: "Plans & Pricing",
      heading: "Pick the plan that fits your team",
      subtitle: "Start free and upgrade as you need more capacity and seats.",
      cta: "Create account",
      contact: "Talk to sales",
      tableTitle: "Quick comparison",
      perMonth: "per month",
      highlight: "Best to scale",
      labels: {
        plan: "Plan",
        price: "Price",
        questions: "Questions",
        users: "Users",
        datasources: "Datasources",
      },
      limitsNote: "Limits are enforced automatically by plan",
    },
  } as const

  const t = copy[language]

  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
            {t.heading}
          </h2>
          <p className="text-lg text-muted-foreground text-balance">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planCatalog.map((tier, index) => (
            <motion.div
              key={tier.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card
                className={`p-6 h-full border-border/60 bg-card/80 backdrop-blur ${
                  tier.code === "pro" ? "border-primary/50 shadow-lg shadow-primary/15" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{tier.code}</p>
                    <h3 className="text-2xl font-semibold text-foreground">{tier.name}</h3>
                  </div>
                  {tier.code === "pro" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                      {t.highlight}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-sm text-muted-foreground">{t.perMonth}</span>}
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span>{t.labels.questions}: {tier.questions}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span>{t.labels.users}: {tier.users}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span>{t.labels.datasources}: {tier.datasources}</span>
                  </li>
                </ul>
                <Button
                  asChild
                  className={`w-full group ${tier.code === "pro" ? "" : "bg-secondary/80 text-foreground hover:bg-secondary/60"}`}
                >
                  <Link href={`/register?plan=${tier.code}`}>
                    {t.cta}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full mt-2 text-muted-foreground hover:text-foreground">
                  <Link href="/billing">{t.contact}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-2xl border border-border/60 bg-card/70 backdrop-blur"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between flex-col gap-3 sm:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.tableTitle}</p>
              <h3 className="text-lg font-semibold text-foreground">
                {t.labels.plan} · {t.labels.price} · {t.labels.questions} · {t.labels.users} · {t.labels.datasources}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <span>{t.limitsNote}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border/60">
                  <th className="px-6 py-4 font-medium">{t.labels.plan}</th>
                  <th className="px-6 py-4 font-medium">{t.labels.price}</th>
                  <th className="px-6 py-4 font-medium">{t.labels.questions}</th>
                  <th className="px-6 py-4 font-medium">{t.labels.users}</th>
                  <th className="px-6 py-4 font-medium">{t.labels.datasources}</th>
                </tr>
              </thead>
              <tbody>
                {planCatalog.map((tier) => (
                  <tr key={`table-${tier.code}`} className="border-b border-border/40 last:border-0">
                    <td className="px-6 py-4 text-foreground font-medium">{tier.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tier.price}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tier.questions}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tier.users}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tier.datasources}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
