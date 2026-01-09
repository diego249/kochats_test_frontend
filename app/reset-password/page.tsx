"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/language-provider"
import { ApiError, confirmPasswordReset, validatePasswordReset, type MfaMethod } from "@/lib/api"
import { CheckCircle2, KeyRound, Loader2, Lock, ShieldCheck, TriangleAlert } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const token = searchParams.get("token") || ""

  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaMethods, setMfaMethods] = useState<MfaMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>("totp")
  const [mfaCode, setMfaCode] = useState("")
  const [mfaError, setMfaError] = useState("")

  const copy = useMemo(
    () => ({
      es: {
        title: "Restablecer contraseña",
        subtitle: "Crea una nueva contraseña para tu cuenta.",
        validating: "Validando enlace...",
        invalid: "El enlace no es válido o expiró. Solicita uno nuevo.",
        missingToken: "Falta el token del enlace. Solicita uno nuevo desde tu correo.",
        passwordLabel: "Nueva contraseña",
        passwordPlaceholder: "Mínimo 8 caracteres",
        confirmLabel: "Confirmar contraseña",
        submit: "Actualizar contraseña",
        submitting: "Actualizando...",
        passwordMismatch: "Las contraseñas no coinciden.",
        passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
        genericError: "No pudimos actualizar la contraseña. Intenta nuevamente.",
        success: "Contraseña actualizada. Inicia sesión con tu nueva contraseña.",
        goToLogin: "Ir a iniciar sesión",
        requestLink: "Solicitar nuevo enlace",
        mfaTitle: "Verificación adicional",
        mfaSubtitle: "Ingresa el código de tu app o un código de respaldo para continuar.",
        mfaLabel: "Código MFA",
        mfaRequired: "Ingresa un código MFA para confirmar.",
        invalidMfa: "Código MFA inválido.",
      },
      en: {
        title: "Reset password",
        subtitle: "Create a new password for your account.",
        validating: "Validating link...",
        invalid: "The link is invalid or expired. Request a new one.",
        missingToken: "The recovery token is missing. Request a new link from your email.",
        passwordLabel: "New password",
        passwordPlaceholder: "Minimum 8 characters",
        confirmLabel: "Confirm password",
        submit: "Update password",
        submitting: "Updating...",
        passwordMismatch: "Passwords do not match.",
        passwordTooShort: "Password must be at least 8 characters.",
        genericError: "We couldn't update the password. Please try again.",
        success: "Password updated. Sign in with your new password.",
        goToLogin: "Go to sign in",
        requestLink: "Request new link",
        mfaTitle: "Additional verification",
        mfaSubtitle: "Enter the code from your authenticator app or a backup code to continue.",
        mfaLabel: "MFA code",
        mfaRequired: "Enter an MFA code to confirm.",
        invalidMfa: "Invalid MFA code.",
      },
    }),
    [],
  )

  const t = copy[language]
  const mfaLabels: Record<MfaMethod, string> = {
    totp: language === "es" ? "App (TOTP)" : "App (TOTP)",
    email: language === "es" ? "Correo" : "Email",
    backup: language === "es" ? "Código de respaldo" : "Backup code",
  }

  useEffect(() => {
    const validateToken = async () => {
      setValidating(true)
      setTokenValid(false)
      setValidationError("")
      setMfaRequired(false)
      setMfaMethods([])
      setMfaCode("")
      setMfaError("")
      setSuccess(false)

      if (!token) {
        setValidating(false)
        setValidationError(t.missingToken)
        return
      }

      try {
        const data = await validatePasswordReset(token)
        if (data?.valid) {
          const methods = (data.methods || []) as MfaMethod[]
          setMfaRequired(!!data.mfa_required)
          setMfaMethods(methods)
          setSelectedMethod(methods[0] ?? "totp")
          setTokenValid(true)
        } else {
          setValidationError(t.invalid)
        }
      } catch (err: any) {
        if (err instanceof ApiError && err.status === 400) {
          setValidationError(t.invalid)
        } else {
          setValidationError(err.message || t.genericError)
        }
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token, t.invalid, t.genericError, t.missingToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setPasswordErrors([])
    setMfaError("")

    if (!token) {
      setFormError(t.invalid)
      return
    }
    if (password.length < 8) {
      setFormError(t.passwordTooShort)
      return
    }
    if (password !== confirmPassword) {
      setFormError(t.passwordMismatch)
      return
    }
    if (mfaRequired && !mfaCode) {
      setMfaError(t.mfaRequired)
      return
    }

    setSubmitting(true)
    try {
      await confirmPasswordReset(token, password, mfaRequired ? { method: selectedMethod, code: mfaCode } : undefined)
      setSuccess(true)
      setTokenValid(false)
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.data?.error === "invalid_or_expired_token") {
          setValidationError(t.invalid)
          setTokenValid(false)
        } else if (err.data?.error === "invalid_mfa_code") {
          setMfaError(t.invalidMfa)
        } else if (err.data?.error === "invalid_password") {
          const details = Array.isArray(err.data?.details) ? err.data.details : []
          setPasswordErrors(details.length ? details : [t.genericError])
        } else {
          setFormError(err.message || t.genericError)
        }
      } else {
        setFormError(err?.message || t.genericError)
      }
    } finally {
      setSubmitting(false)
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
        <div className="w-full max-w-lg space-y-8 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
              <KeyRound className="w-4 h-4" />
              {t.title}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.subtitle}</h1>
          </div>

          {validationError && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 text-left">
              <AlertDescription className="flex items-center gap-2">
                <TriangleAlert className="w-4 h-4" />
                {validationError}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-left">
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {t.success}
              </AlertDescription>
            </Alert>
          )}

          {validating && (
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t.validating}</span>
            </div>
          )}

          {!validating && !tokenValid && !success && (
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                {t.requestLink}
              </Link>
            </div>
          )}

          {tokenValid && !success && (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              {!!passwordErrors.length && (
                <Alert variant="destructive">
                  <AlertDescription className="space-y-1">
                    {passwordErrors.map((msg, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <TriangleAlert className="w-4 h-4 mt-0.5" />
                        <span>{msg}</span>
                      </div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                  {t.passwordLabel}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    minLength={8}
                    required
                    disabled={submitting}
                    className="h-12 rounded-full pl-11 bg-card border-border focus-visible:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">
                  {t.confirmLabel}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    minLength={8}
                    required
                    disabled={submitting}
                    className="h-12 rounded-full pl-11 bg-card border-border focus-visible:ring-primary/30"
                  />
                </div>
              </div>

              {mfaRequired && (
                <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.mfaTitle}</p>
                      <p className="text-xs text-muted-foreground">{t.mfaSubtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(mfaMethods.length ? mfaMethods : (["totp", "backup"] as MfaMethod[])).map((method) => (
                      <Button
                        key={method}
                        type="button"
                        size="sm"
                        variant={selectedMethod === method ? "default" : "outline"}
                        onClick={() => setSelectedMethod(method)}
                      >
                        {mfaLabels[method]}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mfa-code" className="text-xs font-medium text-muted-foreground">
                      {t.mfaLabel}
                    </Label>
                    <Input
                      id="mfa-code"
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={10}
                      disabled={submitting}
                      required
                    />
                    {mfaError && (
                      <p className="text-xs text-destructive font-medium" role="alert">
                        {mfaError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-full text-base font-semibold shadow-sm hover:shadow-primary/15 transition-all duration-200"
                disabled={submitting}
              >
                {submitting ? t.submitting : t.submit}
              </Button>
            </form>
          )}

          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              {t.goToLogin}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
