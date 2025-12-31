"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

const technologies = [
  { name: "Python", category: "Backend" },
  { name: "TensorFlow", category: "ML" },
  { name: "PyTorch", category: "ML" },
  { name: "Scikit-learn", category: "ML" },
  { name: "FastAPI", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
]

export function TechStack() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "Tecnologías de",
      accent: "Vanguardia",
      subtitle: "Utilizamos las mejores herramientas y frameworks para construir soluciones robustas y escalables",
      note:
        "Nuestro stack tecnológico está en constante evolución para incorporar las últimas innovaciones en inteligencia artificial y desarrollo de software.",
    },
    en: {
      title: "Cutting-edge",
      accent: "Technologies",
      subtitle: "We use the best tools and frameworks to build robust, scalable solutions",
      note:
        "Our tech stack evolves constantly to adopt the latest innovations in AI and software development.",
    },
  } as const

  const t = copy[language]

  return (
    <section id="tecnologia" className="py-20 md:py-32">
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

        {/* Tech Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 md:p-12 bg-card border-border">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="text-center">
                    <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {tech.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{tech.category}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.note}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
