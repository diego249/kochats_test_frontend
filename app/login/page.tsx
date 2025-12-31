"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setAuthToken, setAuthUser } from "@/lib/auth"
import { login as apiLogin } from "@/lib/api"
import { Lock, Mail, Eye, EyeOff, ChevronRight } from "lucide-react"
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
    },
  } as const

  const t = copy[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiLogin(username, password)
      setAuthToken(response.token)
      setAuthUser({
        token: response.token,
        username: response.username,
        email: response.email,
        userType: response.user_type,
        organizationId: response.organization.id,
        organizationName: response.organization.name,
        isOrgOwner: response.is_org_owner,
        plan: response.plan,
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
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
