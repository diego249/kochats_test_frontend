"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getAuthUser, setAuthUser } from "@/lib/auth"
import { getSubscription, listPlans, updateSubscription, type Plan, type Subscription } from "@/lib/api"
import { planCatalog, planCatalogMap, defaultPlanCode } from "@/lib/plan-catalog"
import { useLanguage } from "@/components/language-provider"
import { CreditCard, CheckCircle2, Shield, Gauge, Clock, ArrowRight } from "lucide-react"

type PlanDisplay = {
  code: string
  name: string
  price: string
  questions: string
  users: string
  datasources: string
  isActive: boolean
}

export default function BillingPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<PlanDisplay[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [updatingPlanCode, setUpdatingPlanCode] = useState<string | null>(null)

  const copy = {
    es: {
      title: "Planes y facturación",
      subtitle: "Consulta tu suscripción y cambia de plan cuando lo necesites.",
      currentPlan: "Plan actual",
      status: "Estado de la suscripción",
      limits: "Límites del plan",
      started: "Inicio",
      ends: "Fin",
      changePlan: "Cambiar de plan",
      upgradeCta: "Seleccionar plan",
      currentTag: "Activo",
      planUpdated: "Plan actualizado correctamente.",
      planUpdateError: "No pudimos actualizar el plan. Intenta nuevamente.",
      unlimited: "Ilimitado",
      custom: "Personalizado",
      loading: "Cargando información de facturación...",
      note: "Solo los owners pueden actualizar el plan de la organización.",
      labels: {
        questions: "Preguntas",
        users: "Usuarios",
        datasources: "Datasources",
        updating: "Actualizando...",
      },
    },
    en: {
      title: "Plans & Billing",
      subtitle: "Review your subscription and switch plans whenever you need.",
      currentPlan: "Current plan",
      status: "Subscription status",
      limits: "Plan limits",
      started: "Start",
      ends: "End",
      changePlan: "Change plan",
      upgradeCta: "Choose plan",
      currentTag: "Current",
      planUpdated: "Plan updated successfully.",
      planUpdateError: "We couldn't update the plan. Please try again.",
      unlimited: "Unlimited",
      custom: "Custom",
      loading: "Loading billing information...",
      note: "Only workspace owners can update the organization plan.",
      labels: {
        questions: "Questions",
        users: "Users",
        datasources: "Datasources",
        updating: "Updating...",
      },
    },
  } as const

  const t = copy[language]

  useEffect(() => {
    const authUser = getAuthUser()
    if (!authUser?.token) {
      router.push("/login")
      return
    }

    if (!authUser.isOrgOwner) {
      router.push("/dashboard")
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [subscriptionRes, plansRes] = await Promise.all([getSubscription(), listPlans()])
        setSubscription(subscriptionRes)

        const availablePlans =
          plansRes && plansRes.length
            ? plansRes.filter((plan) => plan.is_active !== false)
            : []

        const formatLimit = (value: number | null | undefined, fallback?: string) => {
          if (value === null) return t.unlimited
          if (typeof value === "number") return value.toLocaleString()
          return fallback || t.custom
        }

        const toDisplay = (plan: Plan): PlanDisplay => {
          const fallback = planCatalogMap[plan.code]
          const entitlements = plan.entitlements || plan.plan_snapshot?.entitlements
          return {
            code: plan.code,
            name: plan.name || fallback?.name || plan.code,
            price: fallback?.price || t.custom,
            questions: formatLimit(entitlements?.max_questions_per_month, fallback?.questions),
            users: formatLimit(entitlements?.max_users, fallback?.users),
            datasources: formatLimit(entitlements?.max_datasources, fallback?.datasources),
            isActive: plan.is_active !== false,
          }
        }

        const mergedPlans =
          availablePlans.length > 0 ? availablePlans.map((plan) => toDisplay(plan)) : planCatalog.map((plan) => ({ ...plan, isActive: true }))

        setPlans(mergedPlans)
      } catch (err: any) {
        console.error("Error loading billing data:", err)
        setError(err.message || "Failed to load billing data")
        setPlans(planCatalog.map((plan) => ({ ...plan, isActive: true })))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router, t.custom, t.unlimited])

  const currentPlanCode =
    subscription?.plan?.code ||
    subscription?.plan_snapshot?.code ||
    getAuthUser()?.plan ||
    defaultPlanCode

  const currentPlanDisplay = planCatalogMap[currentPlanCode]
  const currentEntitlements =
    subscription?.entitlements ||
    subscription?.plan?.entitlements ||
    subscription?.plan_snapshot?.entitlements ||
    null

  const formatLimit = (value?: number | null, fallback?: string) => {
    if (value === null) return t.unlimited
    if (typeof value === "number") return value.toLocaleString()
    return fallback || t.custom
  }

  const planOptions = useMemo(() => {
    const catalogOrder = planCatalog.map((p) => p.code)
    return [...plans].sort((a, b) => catalogOrder.indexOf(a.code) - catalogOrder.indexOf(b.code))
  }, [plans])

  const handlePlanChange = async (planCode: string) => {
    setUpdatingPlanCode(planCode)
    setError(null)
    setSuccess(null)
    try {
      const updated = await updateSubscription(planCode)
      setSubscription(updated)
      const authUser = getAuthUser()
      if (authUser) {
        setAuthUser({ ...authUser, plan: updated.plan?.code ?? planCode })
      }
      setSuccess(t.planUpdated)
    } catch (err: any) {
      console.error("Error updating plan:", err)
      setError(err.message || t.planUpdateError)
    } finally {
      setUpdatingPlanCode(null)
    }
  }

  const isCurrentPlan = (code: string) => code === currentPlanCode

  const renderLimitRow = (label: string, value?: number | null, fallback?: string) => (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground font-medium">{formatLimit(value, fallback)}</span>
    </div>
  )

  const renderPlanCard = (plan: PlanDisplay) => {
    const disabled = isCurrentPlan(plan.code) || updatingPlanCode === plan.code
    return (
      <Card
        key={plan.code}
        className={`h-full border-border/60 bg-card/70 ${isCurrentPlan(plan.code) ? "border-primary/60 shadow-primary/10 shadow-lg" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{plan.code}</p>
              <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
            </div>
            {isCurrentPlan(plan.code) && <Badge variant="outline">{t.currentTag}</Badge>}
          </div>
          <div className="text-2xl font-semibold text-foreground">{plan.price}</div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">{t.limits}</p>
            </div>
            <span className="col-span-2 text-xs text-right text-muted-foreground"> </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.labels.questions}</span>
              <span className="text-foreground font-medium">{plan.questions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.labels.users}</span>
              <span className="text-foreground font-medium">{plan.users}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.labels.datasources}</span>
              <span className="text-foreground font-medium">{plan.datasources}</span>
            </div>
          </div>
          <Button
            className="w-full mt-3"
            disabled={disabled}
            onClick={() => handlePlanChange(plan.code)}
          >
            {updatingPlanCode === plan.code ? t.labels.updating : isCurrentPlan(plan.code) ? t.currentTag : t.upgradeCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6" id="upgrade">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CreditCard className="w-5 h-5" />
                  {t.title}
                </div>
                <p className="text-muted-foreground">{t.subtitle}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {t.note}
              </Badge>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-primary/40 bg-primary/10">
                <AlertDescription className="text-foreground">{success}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-36 rounded-xl" />
                <Skeleton className="h-36 rounded-xl" />
                <Skeleton className="h-36 rounded-xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {t.currentPlan}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-semibold text-foreground">
                      {subscription?.plan?.name || currentPlanDisplay?.name || currentPlanCode}
                    </div>
                    <p className="text-muted-foreground">
                      {planCatalogMap[currentPlanCode]?.price || t.custom}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Gauge className="w-4 h-4 text-secondary" />
                      {t.limits}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {renderLimitRow(
                      t.labels.questions,
                      currentEntitlements?.max_questions_per_month,
                      planCatalogMap[currentPlanCode]?.questions,
                    )}
                    {renderLimitRow(
                      t.labels.users,
                      currentEntitlements?.max_users,
                      planCatalogMap[currentPlanCode]?.users,
                    )}
                    {renderLimitRow(
                      t.labels.datasources,
                      currentEntitlements?.max_datasources,
                      planCatalogMap[currentPlanCode]?.datasources,
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {t.status}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>{t.started}</span>
                      <span className="text-foreground">
                        {subscription?.started_at
                          ? new Date(subscription.started_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t.ends}</span>
                      <span className="text-foreground">
                        {subscription?.ends_at ? new Date(subscription.ends_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t.status}</span>
                      <Badge variant="outline" className="capitalize">
                        {subscription?.status || "active"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="bg-card/70 border-border/60">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  {t.changePlan}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t.subtitle}
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {planOptions.map((plan) => renderPlanCard(plan))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
