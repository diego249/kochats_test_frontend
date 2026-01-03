"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks =
    language === "es"
      ? {
          Servicios: [
            { label: "Asistentes", href: "#agentes" },
            { label: "Casos de uso", href: "#agentes" },
            { label: "Cómo funciona", href: "#proceso" },
            { label: "Planes", href: "#pricing" },
            { label: "Contacto", href: "/login" },
          ],
        }
      : {
          Services: [
            { label: "Assistants", href: "#agentes" },
            { label: "Use cases", href: "#agentes" },
            { label: "How it works", href: "#proceso" },
            { label: "Pricing", href: "#pricing" },
            { label: "Contact", href: "/login" },
          ],
        }

  const copy = {
    es: {
      description:
        "Plataforma para crear asistentes conectados a tus datos y herramientas.",
      privacy: "Privacidad",
      terms: "Términos",
      rights: "Todos los derechos reservados.",
    },
    en: {
      description: "Platform to build assistants connected to your data and tools.",
      privacy: "Privacy",
      terms: "Terms",
      rights: "All rights reserved.",
    },
  } as const

  const t = copy[language]

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Kochats
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-4">
                {t.description}
              </p>
              <a href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                contacto@kochats.ai
              </a>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">© {currentYear} Kochats. {t.rights}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              {t.privacy}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t.terms}
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
