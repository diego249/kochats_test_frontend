"use client"

import type React from "react"

import { useState } from "react"
import { useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setAuthToken, setAuthUser } from "@/lib/auth"
import { listPlans, register as apiRegister, type Plan } from "@/lib/api"
import { Lock, Mail, User, Eye, EyeOff, ChevronRight, Sparkles, BadgeCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"
import { defaultPlanCode, planCatalog, planCatalogMap } from "@/lib/plan-catalog"

type PlanDisplay = {
  code: string
  name: string
  price: string
  questions: string
  users: string
  datasources: string
  isActive: boolean
}

const catalogPlansDisplay: PlanDisplay[] = planCatalog.map((plan) => ({
  ...plan,
  isActive: true,
}))

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [plans, setPlans] = useState<PlanDisplay[]>(catalogPlansDisplay)
  const [selectedPlan, setSelectedPlan] = useState<string>(searchParams.get("plan") || defaultPlanCode)
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState<string | null>(null)

  const copy = {
    es: {
      title: "Crea tu cuenta",
      subtitle: "Empieza a construir tus agentes inteligentes",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "nombre@empresa.com",
      usernameLabel: "Usuario",
      usernamePlaceholder: "Escoge un usuario",
      passwordLabel: "Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      submitIdle: "Continuar",
      submitLoading: "Creando cuenta...",
      haveAccount: "¿Ya tienes una cuenta?",
      loginCta: "Inicia sesión",
      divider: "o",
      socialGoogle: "Continuar con Google",
      socialApple: "Continuar con Apple",
      socialMicrosoft: "Continuar con Microsoft",
      terms: "Términos de uso",
      privacy: "Política de privacidad",
      planLabel: "Selecciona tu plan",
      planHint: "Puedes cambiarlo luego dentro de la app.",
      planError: "No pudimos cargar los planes. Usa Free o intenta nuevamente.",
      planLoading: "Cargando planes...",
      selected: "Seleccionado",
      limits: {
        questions: "Preguntas",
        users: "Usuarios",
        datasources: "Datasources",
      },
    },
    en: {
      title: "Create your account",
      subtitle: "Start building your intelligent agents",
      emailLabel: "Email",
      emailPlaceholder: "name@company.com",
      usernameLabel: "Username",
      usernamePlaceholder: "Choose a username",
      passwordLabel: "Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submitIdle: "Continue",
      submitLoading: "Creating account...",
      haveAccount: "Already have an account?",
      loginCta: "Sign in",
      divider: "or",
      socialGoogle: "Continue with Google",
      socialApple: "Continue with Apple",
      socialMicrosoft: "Continue with Microsoft",
      terms: "Terms of use",
      privacy: "Privacy policy",
      planLabel: "Choose your plan",
      planHint: "You can change it later from the app.",
      planError: "We couldn't load plans. Pick Free or try again.",
      planLoading: "Loading plans...",
      selected: "Selected",
      limits: {
        questions: "Questions",
        users: "Users",
        datasources: "Datasources",
      },
    },
  } as const

  const t = copy[language]

  const sortedPlans = useMemo(() => {
    const catalogOrder = planCatalog.map((p) => p.code)
    return [...plans].sort((a, b) => catalogOrder.indexOf(a.code) - catalogOrder.indexOf(b.code))
  }, [plans])

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true)
      setPlansError(null)
      try {
        const data = await listPlans(false, { skipAuthRedirect: true })
        const activePlans = (data || []).filter((plan) => plan.is_active !== false)

        const formatLimit = (value: number | null | undefined, fallback: string) => {
          const unlimitedLabel = language === "es" ? "Ilimitado" : "Unlimited"
          if (value === null) return unlimitedLabel
          if (typeof value === "number") return value.toLocaleString()
          return fallback || unlimitedLabel
        }

        const merged: PlanDisplay[] =
          activePlans.length > 0
            ? activePlans.map((plan: Plan) => {
                const fallback = planCatalogMap[plan.code]
                const entitlements = plan.entitlements || plan.plan_snapshot?.entitlements
                return {
                  code: plan.code,
                  name: plan.name || fallback?.name || plan.code,
                  price: fallback?.price || "Custom",
                  questions: formatLimit(entitlements?.max_questions_per_month, fallback?.questions || "Custom"),
                  users: formatLimit(entitlements?.max_users, fallback?.users || "Custom"),
                  datasources: formatLimit(entitlements?.max_datasources, fallback?.datasources || "Custom"),
                  isActive: plan.is_active !== false,
                }
              })
            : catalogPlansDisplay

        setPlans(merged)

        const planParam = searchParams.get("plan")
        setSelectedPlan((prev) => {
          if (planParam && merged.some((p) => p.code === planParam)) {
            return planParam
          }
          if (!merged.some((p) => p.code === prev)) {
            return defaultPlanCode
          }
          return prev
        })
      } catch (err: any) {
        console.error("Error loading plans:", err)
        setPlans(catalogPlansDisplay)
        setPlansError(t.planError)
      } finally {
        setPlansLoading(false)
      }
    }

    fetchPlans()
  }, [searchParams, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiRegister(email, username, password, selectedPlan || undefined)
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
      setError(err.message || "Registration failed. Please try again.")
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

            <div className="space-y-2 text-left">
              <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">
                {t.usernameLabel}
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                  placeholder="Crea una contraseña"
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

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  {t.planLabel}
                </Label>
                <span className="text-[11px] text-muted-foreground">{t.planHint}</span>
              </div>
              {plansError && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
                  <AlertDescription>{plansError}</AlertDescription>
                </Alert>
              )}
              {plansLoading && <p className="text-xs text-muted-foreground">{t.planLoading}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plansLoading
                  ? Array.from({ length: 2 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-20 rounded-xl border border-border/60 bg-card/60 animate-pulse"
                      />
                    ))
                  : sortedPlans.map((plan) => {
                      const isSelected = plan.code === selectedPlan
                      return (
                        <button
                          key={plan.code}
                          type="button"
                          onClick={() => setSelectedPlan(plan.code)}
                          className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? "border-primary/60 bg-primary/10 shadow-sm shadow-primary/20"
                              : "border-border/60 bg-card/60 hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                {plan.code}
                              </p>
                              <p className="text-base font-semibold text-foreground">{plan.name}</p>
                            </div>
                            <div className="flex flex-col items-end text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">{plan.price}</span>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-xs text-primary">
                                  <BadgeCheck className="w-3 h-3" /> {t.selected}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                            <span>
                              {t.limits.questions}: <span className="text-foreground">{plan.questions}</span>
                            </span>
                            <span>
                              {t.limits.users}: <span className="text-foreground">{plan.users}</span>
                            </span>
                            <span>
                              {t.limits.datasources}: <span className="text-foreground">{plan.datasources}</span>
                            </span>
                          </div>
                        </button>
                      )
                    })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-base font-semibold shadow-sm hover:shadow-primary/15 transition-all duration-200"
              disabled={loading || plansLoading}
            >
              {loading ? t.submitLoading : t.submitIdle}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            {t.haveAccount}{" "}
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              {t.loginCta}
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
