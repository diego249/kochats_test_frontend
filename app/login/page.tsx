"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login as apiLogin, sendMfaEmailCode, verifyMfaChallenge, type MfaMethod } from "@/lib/api"
import { Lock, Mail, Eye, EyeOff, ChevronRight, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"

export default function LoginPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaToken, setMfaToken] = useState("")
  const [mfaMethods, setMfaMethods] = useState<MfaMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>("totp")
  const [mfaCode, setMfaCode] = useState("")
  const [mfaError, setMfaError] = useState("")
  const [mfaMessage, setMfaMessage] = useState("")
  const [mfaLoading, setMfaLoading] = useState(false)
  const [sendingEmailCode, setSendingEmailCode] = useState(false)

  const copy = {
    es: {
      title: "Bienvenido de nuevo",
      subtitle: "Accede a tu cuenta para continuar",
      usernameLabel: "Usuario o correo",
      usernamePlaceholder: "nombre@empresa.com",
      passwordLabel: "Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      submitIdle: "Continuar",
      submitLoading: "Ingresando...",
      switchPrompt: "¿No tienes una cuenta?",
      switchCta: "Regístrate",
      divider: "o",
      socialGoogle: "Continuar con Google",
      socialApple: "Continuar con Apple",
      socialMicrosoft: "Continuar con Microsoft",
      terms: "Términos de uso",
      privacy: "Política de privacidad",
      mfaTitle: "Necesitamos un segundo paso",
      mfaSubtitle: "Ingresa el código de tu app, correo o uno de respaldo para continuar.",
      mfaMethodLabel: "Método",
      mfaCodeLabel: "Código MFA",
      mfaSubmit: "Verificar y continuar",
      mfaSendEmail: "Enviar código por correo",
      mfaEmailSent: "Código enviado a tu correo.",
      mfaError: "No pudimos verificar el código. Intenta nuevamente.",
      forgotPrompt: "¿Olvidaste tu contraseña?",
    },
    en: {
      title: "Welcome back",
      subtitle: "Sign in to continue",
      usernameLabel: "Username or email",
      usernamePlaceholder: "name@company.com",
      passwordLabel: "Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submitIdle: "Continue",
      submitLoading: "Signing in...",
      switchPrompt: "Don't have an account?",
      switchCta: "Sign up",
      divider: "or",
      socialGoogle: "Continue with Google",
      socialApple: "Continue with Apple",
      socialMicrosoft: "Continue with Microsoft",
      terms: "Terms of use",
      privacy: "Privacy policy",
      mfaTitle: "A second step is required",
      mfaSubtitle: "Enter the code from your authenticator, email, or a backup code.",
      mfaMethodLabel: "Method",
      mfaCodeLabel: "MFA code",
      mfaSubmit: "Verify and continue",
      mfaSendEmail: "Send email code",
      mfaEmailSent: "Email code sent.",
      mfaError: "We couldn't verify the code. Please try again.",
      forgotPrompt: "Forgot your password?",
    },
  } as const

  const t = copy[language]
  const mfaMethodLabels: Record<MfaMethod, string> = {
    totp: language === "es" ? "App (TOTP)" : "App (TOTP)",
    email: language === "es" ? "Correo" : "Email",
    backup: language === "es" ? "Código de respaldo" : "Backup code",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMfaError("")
    setMfaMessage("")
    setMfaRequired(false)
    setMfaToken("")
    setMfaMethods([])
    setSelectedMethod("totp")
    setMfaCode("")
    setLoading(true)

    try {
      const response = await apiLogin(username, password)
      if (response?.mfa_required) {
        const availableMethods = (response.methods ?? ["totp", "email", "backup"]) as MfaMethod[]
        setMfaRequired(true)
        setMfaToken(response.mfa_token)
        setMfaMethods(availableMethods)
        setSelectedMethod((response.preferred_method as MfaMethod) ?? availableMethods[0] ?? "totp")
        return
      }
      const redirect = response.email_verified === false ? "/verify-email" : "/dashboard"
      router.push(redirect)
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMfaError("")
    setMfaMessage("")
    if (!mfaToken) {
      setMfaError(t.mfaError)
      return
    }
    setMfaLoading(true)
    try {
      const response = await verifyMfaChallenge(selectedMethod, mfaCode, { mfaToken })
      const redirect = response.email_verified === false ? "/verify-email" : "/dashboard"
      router.push(redirect)
    } catch (err: any) {
      setMfaError(err.message || t.mfaError)
    } finally {
      setMfaLoading(false)
    }
  }

  const handleSendMfaEmail = async () => {
    setMfaError("")
    setMfaMessage("")
    setSendingEmailCode(true)
    try {
      await sendMfaEmailCode({ mfaToken })
      setMfaMessage(t.mfaEmailSent)
    } catch (err: any) {
      setMfaError(err.message || t.mfaError)
    } finally {
      setSendingEmailCode(false)
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
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 text-left">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">
                {t.usernameLabel}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.usernamePlaceholder}
                  required
                  disabled={loading}
                  className="h-12 rounded-full pl-11 bg-card border-border focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                {t.passwordLabel}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  disabled={loading}
                  className="h-12 rounded-full pl-11 pr-12 bg-card border-border focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-base font-semibold shadow-sm hover:shadow-primary/15 transition-all duration-200"
              disabled={loading}
            >
              {loading ? t.submitLoading : t.submitIdle}
            </Button>
          </form>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors block"
          >
            {t.forgotPrompt}
          </Link>

          {mfaRequired && (
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.mfaTitle}</p>
                  <p className="text-xs text-muted-foreground">{t.mfaSubtitle}</p>
                </div>
              </div>
              {mfaError && (
                <Alert variant="destructive">
                  <AlertDescription>{mfaError}</AlertDescription>
                </Alert>
              )}
              {mfaMessage && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{mfaMessage}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t.mfaMethodLabel}</Label>
                <div className="flex flex-wrap gap-2">
                  {(mfaMethods.length ? mfaMethods : (["totp", "email", "backup"] as MfaMethod[])).map(
                    (method) => (
                      <Button
                        key={method}
                        type="button"
                        size="sm"
                        variant={selectedMethod === method ? "default" : "outline"}
                        onClick={() => setSelectedMethod(method)}
                      >
                        {mfaMethodLabels[method]}
                      </Button>
                    ),
                  )}
                </div>
              </div>
              <form className="space-y-2" onSubmit={handleMfaSubmit}>
                <Label htmlFor="mfa-code" className="text-xs text-muted-foreground">
                  {t.mfaCodeLabel}
                </Label>
                <Input
                  id="mfa-code"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={10}
                  disabled={mfaLoading}
                  required
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleSendMfaEmail}
                    disabled={sendingEmailCode || !mfaToken}
                  >
                    {sendingEmailCode ? t.submitLoading : t.mfaSendEmail}
                  </Button>
                  <Button type="submit" className="flex-1" disabled={mfaLoading || !mfaCode}>
                    {mfaLoading ? t.submitLoading : t.mfaSubmit}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            {t.switchPrompt}{" "}
            <Link href="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">
              {t.switchCta}
            </Link>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex-1 h-px bg-border" />
            <span className="text-xs uppercase tracking-[0.2em]">{t.divider}</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            {[
              { label: t.socialGoogle, color: "text-red-500", symbol: "G" },
              { label: t.socialApple, color: "text-foreground", symbol: "A" },
              { label: t.socialMicrosoft, color: "text-sky-600", symbol: "M" },
            ].map((option) => (
              <Button
                key={option.label}
                type="button"
                variant="outline"
                disabled
                className="w-full h-12 rounded-full justify-between border-border text-left text-sm font-medium hover:bg-muted/60 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-3">
                  <span className={`w-6 text-center ${option.color}`}>{option.symbol}</span>
                  <span>{option.label}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              {t.terms}
            </Link>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
            <Link href="#" className="hover:text-foreground">
              {t.privacy}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
