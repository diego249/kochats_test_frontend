"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/language-provider"
import { requestPasswordReset } from "@/lib/api"
import { ArrowLeft, Mail, Send } from "lucide-react"

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const copy = useMemo(
    () => ({
      es: {
        title: "Olvidé mi contraseña",
        subtitle: "Ingresa tu correo. Si la cuenta existe, te enviaremos un enlace para restablecerla.",
        emailLabel: "Correo electrónico",
        emailPlaceholder: "nombre@empresa.com",
        submit: "Enviar enlace",
        submitting: "Enviando...",
        success: "Si la cuenta existe, te enviaremos un enlace para restablecer tu contraseña.",
        genericError: "No pudimos enviar la solicitud. Intenta nuevamente.",
        backToLogin: "Volver a iniciar sesión",
      },
      en: {
        title: "Forgot your password?",
        subtitle: "Enter your email. If the account exists, we'll send you a link to reset it.",
        emailLabel: "Email",
        emailPlaceholder: "name@company.com",
        submit: "Send reset link",
        submitting: "Sending...",
        success: "If the account exists, we'll send you a link to reset your password.",
        genericError: "We couldn't process the request. Please try again.",
        backToLogin: "Back to sign in",
      },
    }),
    [],
  )

  const t = copy[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setLoading(true)

    try {
      await requestPasswordReset(email)
      setInfo(t.success)
    } catch (err: any) {
      setError(err.message || t.genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between px-6 py-6 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Kochats</span>
          <span className="text-muted-foreground">Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
              <Send className="w-4 h-4" />
              {t.title}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.subtitle}</h1>
          </div>

          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 text-left">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {info && (
            <Alert className="border-border/60 bg-card/60 text-left">
              <AlertDescription className="flex items-center gap-2">
                <Send className="w-4 h-4 text-secondary" />
                {info}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                {t.emailLabel}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={loading}
                  className="h-12 rounded-full pl-11 bg-card border-border focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-base font-semibold shadow-sm hover:shadow-primary/15 transition-all duration-200"
              disabled={loading}
            >
              {loading ? t.submitting : t.submit}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
