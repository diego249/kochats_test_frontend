"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"
import { ApiError, resendVerification, verifyEmail } from "@/lib/api"
import { getAuthUser, updateAuthUser } from "@/lib/auth"
import { BadgeCheck, Clock, Mail, RefreshCcw } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [emailLocked, setEmailLocked] = useState(false)

  const copy = useMemo(
    () => ({
      es: {
        title: "Verifica tu email",
        subtitle: "Te enviamos un código a tu email. Ingrésalo para verificar tu cuenta.",
        emailLabel: "Correo electrónico",
        codeLabel: "Código de 6 dígitos",
        codePlaceholder: "000000",
        submit: "Verificar email",
        submitting: "Verificando...",
        resendCta: "Reenviar código",
        resendWait: (seconds: number) => `Reenviar en ${seconds}s`,
        resendHint: "¿No recibiste el código?",
        resendSuccess: "Si existe el usuario, enviamos un nuevo código de verificación.",
        rateLimited: "Demasiados reintentos. Espera un minuto antes de reenviar.",
        invalidCode: "Código inválido.",
        expiredCode: "Código expirado, solicita uno nuevo.",
        locked: "Demasiados intentos. Intenta más tarde o solicita un nuevo código.",
        genericError: "No pudimos verificar tu email. Inténtalo de nuevo.",
        success: "Email verificado. Redirigiendo...",
        alreadyVerified: "Tu email ya está verificado.",
        continueLater: "Continuar más tarde",
      },
      en: {
        title: "Verify your email",
        subtitle: "We sent a 6-digit code to your email. Enter it to verify your account.",
        emailLabel: "Email",
        codeLabel: "6-digit code",
        codePlaceholder: "000000",
        submit: "Verify email",
        submitting: "Verifying...",
        resendCta: "Resend code",
        resendWait: (seconds: number) => `Resend in ${seconds}s`,
        resendHint: "Didn't get the code?",
        resendSuccess: "If the user exists, we sent a new verification code.",
        rateLimited: "Too many retries. Please wait a minute before resending.",
        invalidCode: "Invalid code.",
        expiredCode: "Code expired, request a new one.",
        locked: "Too many attempts. Try later or request a new code.",
        genericError: "We couldn't verify your email. Try again.",
        success: "Email verified. Redirecting...",
        alreadyVerified: "Your email is already verified.",
        continueLater: "Continue later",
      },
    }),
    [],
  )

  const t = copy[language]

  useEffect(() => {
    const storedUser = getAuthUser()
    if (storedUser?.email) {
      setEmail(storedUser.email)
      setEmailLocked(true)
    } else {
      const emailParam = searchParams.get("email")
      if (emailParam) {
        setEmail(emailParam)
      }
    }

    if (storedUser?.emailVerified) {
      redirectAfterVerification()
    }
  }, [searchParams])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const redirectAfterVerification = () => {
    if (typeof window === "undefined") {
      router.push("/dashboard")
      return
    }

    const pending = localStorage.getItem("pendingVerificationPath")
    localStorage.removeItem("pendingVerificationPath")
    router.push(pending && pending !== "/verify-email" ? pending : "/dashboard")
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")

    if (!email || code.length !== 6) {
      setError(language === "es" ? "Ingresa tu email y el código de 6 dígitos." : "Enter your email and the 6-digit code.")
      return
    }

    setLoading(true)
    try {
      const result = await verifyEmail(email, code)
      updateAuthUser({
        emailVerified: true,
        verificationRequired: false,
        emailVerifiedAt: result?.email_verified_at ?? new Date().toISOString(),
      })
      setInfo(t.success)
      redirectAfterVerification()
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          if (err.message.toLowerCase().includes("expir")) {
            setError(t.expiredCode)
          } else if (err.message.toLowerCase().includes("invál") || err.message.toLowerCase().includes("invalid")) {
            setError(t.invalidCode)
          } else {
            setError(err.message || t.genericError)
          }
        } else if (err.status === 423) {
          setError(t.locked)
        } else {
          setError(err.message || t.genericError)
        }
      } else {
        setError(t.genericError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setInfo("")

    if (!email) {
      setError(language === "es" ? "Ingresa tu email para reenviar el código." : "Enter your email to resend the code.")
      return
    }

    try {
      const response = await resendVerification(email)
      const detail = (response as any)?.detail
      setInfo(detail || t.resendSuccess)
      setResendCooldown(60)
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 429) {
        setError(t.rateLimited)
        return
      }
      setError(err.message || t.genericError)
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
              <BadgeCheck className="w-4 h-4" />
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
                <BadgeCheck className="w-4 h-4 text-secondary" />
                {info}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
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
                  placeholder="nombre@empresa.com"
                  required
                  disabled={emailLocked || loading}
                  className="h-12 rounded-full pl-11 bg-card border-border focus-visible:ring-primary/30"
                />
              </div>
              {emailLocked && (
                <p className="text-[11px] text-muted-foreground">
                  {language === "es" ? "Usando el email de tu sesión." : "Using the email from your session."}
                </p>
              )}
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="code" className="text-xs font-medium text-muted-foreground">
                {t.codeLabel}
              </Label>
              <Input
                id="code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={t.codePlaceholder}
                required
                disabled={loading}
                className="h-12 text-center tracking-[0.4em] text-lg uppercase"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-base font-semibold shadow-sm hover:shadow-primary/15 transition-all duration-200"
              disabled={loading}
            >
              {loading ? t.submitting : t.submit}
            </Button>
          </form>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              {t.resendHint}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="w-full h-11 rounded-full gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              {resendCooldown > 0 ? t.resendWait(resendCooldown) : t.resendCta}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/dashboard")}
            >
              {t.continueLater}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              {language === "es" ? "Volver al inicio de sesión" : "Back to login"}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
