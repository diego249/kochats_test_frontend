"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ApiError, updateOwnerPassword } from "@/lib/api"
import { getAuthToken, getAuthUser, type AuthUser } from "@/lib/auth"
import { useLanguage } from "@/components/language-provider"
import { BadgeCheck, CalendarClock, KeyRound, Lock, Mail, ShieldAlert, User, ShieldCheck } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const copy = useMemo(
    () => ({
      es: {
        title: "Cómo accedes a Kochats",
        subtitle: "Mantén estos datos al día para proteger tu cuenta de propietario.",
        profile: {
          heading: "Perfil y acceso",
          username: "Usuario",
          email: "Correo",
          verified: "Email verificado",
          notVerified: "Email pendiente de verificación",
          verifyCta: "Verificar email",
          verifyHint: "Necesitas verificar tu email para cambiar la contraseña.",
        },
        password: {
          heading: "Contraseña",
          subtitle: "Recomendamos cambiarla de vez en cuando.",
          current: "Contraseña actual",
          new: "Nueva contraseña",
          confirm: "Confirmar nueva contraseña",
          submit: "Guardar",
          submitting: "Guardando...",
          mismatch: "Las contraseñas nuevas no coinciden.",
          tooShort: "La contraseña debe tener al menos 8 caracteres.",
          ownerOnly: "Solo el propietario de la organización puede cambiar su contraseña.",
          verifyFirst: "Verifica tu email para cambiar la contraseña.",
          success: "Contraseña actualizada. Inicia sesión automáticamente con el nuevo token.",
          genericError: "No pudimos actualizar la contraseña. Intenta nuevamente.",
          cta: "Cambiar contraseña",
          hide: "Cerrar formulario",
          lastChange: "Última actualización",
          unknown: "No disponible",
        },
        badges: {
          owner: "Propietario",
          plan: "Plan",
        },
        headerHint: "Acceso y seguridad",
      },
      en: {
        title: "How you access Kochats",
        subtitle: "Keep this information current to protect your owner account.",
        profile: {
          heading: "Profile & access",
          username: "Username",
          email: "Email",
          verified: "Email verified",
          notVerified: "Email pending verification",
          verifyCta: "Verify email",
          verifyHint: "You need to verify your email before changing the password.",
        },
        password: {
          heading: "Password",
          subtitle: "We recommend updating it periodically.",
          current: "Current password",
          new: "New password",
          confirm: "Confirm new password",
          submit: "Save",
          submitting: "Saving...",
          mismatch: "New passwords do not match.",
          tooShort: "Password must be at least 8 characters long.",
          ownerOnly: "Only the organization owner can change this password.",
          verifyFirst: "Verify your email to change the password.",
          success: "Password updated. You are now signed in with the new token.",
          genericError: "We couldn't update the password. Please try again.",
          cta: "Change password",
          hide: "Close form",
          lastChange: "Last update",
          unknown: "Not available",
        },
        badges: {
          owner: "Owner",
          plan: "Plan",
        },
        headerHint: "Access & security",
      },
    }),
    [],
  )

  const t = copy[language]
  const canChangePassword = !!authUser?.isOrgOwner && !!authUser?.emailVerified
  const disabledReason = !authUser?.isOrgOwner
    ? t.password.ownerOnly
    : !authUser?.emailVerified
      ? t.password.verifyFirst
      : ""

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
    setAuthUser(getAuthUser())
  }, [router])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!authUser?.isOrgOwner) {
      setError(t.password.ownerOnly)
      return
    }

    if (!authUser.emailVerified) {
      setError(t.password.verifyFirst)
      return
    }

    if (newPassword.length < 8) {
      setError(t.password.tooShort)
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t.password.mismatch)
      return
    }

    setLoading(true)
    try {
      await updateOwnerPassword(currentPassword, newPassword)
      setSuccess(t.password.success)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setAuthUser(getAuthUser())
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || t.password.genericError)
      } else {
        setError(t.password.genericError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyRedirect = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingVerificationPath", "/account")
      }
    } catch (err) {
      console.error("Could not persist pending verification path", err)
    }
    router.push("/verify-email")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t.headerHint}
              </p>
              <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
              <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>

            {!authUser?.isOrgOwner && (
              <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-900">
                <AlertDescription>{t.password.ownerOnly}</AlertDescription>
              </Alert>
            )}

            <Card className="rounded-2xl shadow-sm border-border/70 bg-card">
              <CardContent className="p-0">
                <div className="px-6 py-5 bg-muted/60 border-b border-border/70 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{t.profile.heading}</p>
                      <p className="text-xs text-muted-foreground">{t.profile.verifyHint}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {authUser?.plan && (
                        <Badge
                          variant="outline"
                          className="bg-secondary/20 dark:bg-secondary/30 text-foreground border-secondary/40 dark:border-secondary/50"
                        >
                          {t.badges.plan}: {authUser.plan}
                        </Badge>
                      )}
                      {authUser?.isOrgOwner && <Badge variant="secondary">{t.badges.owner}</Badge>}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border/70">
                  <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{authUser?.username}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{authUser?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {authUser?.emailVerified ? t.profile.verified : t.profile.notVerified}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.profile.verifyHint}</p>
                      </div>
                    </div>
                    {authUser?.emailVerified ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="w-4 h-4" />
                        {t.profile.verified}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleVerifyRedirect}
                        className="gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        {t.profile.verifyCta}
                      </Button>
                    )}
                  </div>

                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <KeyRound className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.password.heading}</p>
                          <p className="text-xs text-muted-foreground">{t.password.subtitle}</p>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>
                              {t.password.lastChange}: {t.password.unknown}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPasswordForm((prev) => !prev)}
                        className="gap-2"
                        disabled={!canChangePassword}
                      >
                        {showPasswordForm ? t.password.hide : t.password.cta}
                      </Button>
                    </div>

                    {showPasswordForm && (
                      <div className="mt-4 rounded-xl border border-border/80 bg-muted/50 px-4 py-4">
                        <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                          {error && (
                            <Alert variant="destructive">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          {success && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                              <AlertDescription>{success}</AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="current-password" className="text-xs text-muted-foreground">
                              {t.password.current}
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="current-password"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="pl-10"
                                disabled={loading || !canChangePassword}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-xs text-muted-foreground">
                              {t.password.new}
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              required
                              minLength={8}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              disabled={loading || !canChangePassword}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-xs text-muted-foreground">
                              {t.password.confirm}
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              required
                              minLength={8}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              disabled={loading || !canChangePassword}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={loading || !canChangePassword}>
                            {loading ? t.password.submitting : t.password.submit}
                          </Button>
                        </form>
                        {!canChangePassword && disabledReason && (
                          <p className="text-xs text-muted-foreground mt-3">{disabledReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
