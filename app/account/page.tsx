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
import {
  ApiError,
  confirmMfaTotpSetup,
  disableMfa,
  regenerateBackupCodes,
  sendMfaEmailCode,
  startMfaTotpSetup,
  startEmailChange,
  verifyEmailChange,
  updateOwnerPassword,
  type MfaMethod,
} from "@/lib/api"
import { getAuthToken, getAuthUser, type AuthUser } from "@/lib/auth"
import { useLanguage } from "@/components/language-provider"
import {
  BadgeCheck,
  CalendarClock,
  Copy,
  KeyRound,
  Lock,
  Mail,
  MailCheck,
  QrCode,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  User,
} from "lucide-react"

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
  const [totpSetup, setTotpSetup] = useState<{
    otpauth_url: string
    issuer: string
    account_name: string
    secret: string
  } | null>(null)
  const [totpCode, setTotpCode] = useState("")
  const [totpLoading, setTotpLoading] = useState(false)
  const [mfaError, setMfaError] = useState("")
  const [mfaSuccess, setMfaSuccess] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [regenMethod, setRegenMethod] = useState<MfaMethod>("totp")
  const [regenCode, setRegenCode] = useState("")
  const [regenLoading, setRegenLoading] = useState(false)
  const [regenError, setRegenError] = useState("")
  const [regenSuccess, setRegenSuccess] = useState("")
  const [disableMethod, setDisableMethod] = useState<MfaMethod>("totp")
  const [disableCode, setDisableCode] = useState("")
  const [disableLoading, setDisableLoading] = useState(false)
  const [disableError, setDisableError] = useState("")
  const [disableSuccess, setDisableSuccess] = useState("")
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false)
  const [emailOtpMessage, setEmailOtpMessage] = useState("")
  const [emailOtpError, setEmailOtpError] = useState(false)
  const [passwordMfaMethod, setPasswordMfaMethod] = useState<MfaMethod>("totp")
  const [passwordMfaCode, setPasswordMfaCode] = useState("")
  const [passwordEmailMessage, setPasswordEmailMessage] = useState("")
  const [passwordEmailError, setPasswordEmailError] = useState(false)
  const [passwordEmailLoading, setPasswordEmailLoading] = useState(false)
  const [passwordMfaRequired, setPasswordMfaRequired] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [emailChangeMessage, setEmailChangeMessage] = useState("")
  const [emailChangeError, setEmailChangeError] = useState("")
  const [emailChangeLoading, setEmailChangeLoading] = useState(false)
  const [emailVerifyCode, setEmailVerifyCode] = useState("")
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false)
  const [emailVerifyError, setEmailVerifyError] = useState("")
  const [emailVerifySuccess, setEmailVerifySuccess] = useState("")
  const [emailChangeMethod, setEmailChangeMethod] = useState<MfaMethod>("totp")
  const [emailChangeMfaCode, setEmailChangeMfaCode] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)

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
          changeEmail: "Cambiar email",
          newEmailLabel: "Nuevo correo",
          changeEmailCta: "Actualizar email",
          hideEmailForm: "Cerrar",
          startChange: "Enviar código",
          startHint: "Usa un código MFA para enviar un código al nuevo correo.",
          codeSent: "Enviamos un código al nuevo correo.",
          codeLabel: "Código recibido",
          verifyEmail: "Confirmar nuevo correo",
          emailUpdated: "Correo actualizado y verificado.",
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
          mfaRequired: "Ingresa un código MFA para confirmar el cambio.",
          mfaMethod: "Método",
          mfaCode: "Código MFA",
          sendEmail: "Enviar código al correo",
          emailSent: "Código enviado. Revisa tu bandeja.",
          mfaLocked: "Demasiados intentos. Intenta más tarde.",
          mfaEnableFirst: "Activa MFA antes de cambiar la contraseña.",
        },
        badges: {
          owner: "Propietario",
          plan: "Plan",
        },
        headerHint: "Acceso y seguridad",
        mfa: {
          heading: "Autenticación en dos pasos",
          subtitle: "Activa códigos desde app o correo para proteger tu cuenta.",
          statusEnabled: "Activa",
          statusDisabled: "Desactivada",
          setupCta: "Configurar app de autenticación",
          setupHint: "Escanea el código o copia la clave en tu app y confirma un código de 6 dígitos.",
          secretLabel: "Clave secreta",
          openInApp: "Abrir en app",
          copySecret: "Copiar",
          copied: "Copiado al portapapeles.",
          confirmCta: "Confirmar código",
          confirmPlaceholder: "Código de 6 dígitos",
          enabledSuccess: "Autenticación en dos pasos activada. Guarda tus códigos de respaldo.",
          genericError: "No pudimos completar esta acción. Intenta nuevamente.",
          verifyEmailFirst: "Verifica tu email para configurar MFA.",
          backupCodesTitle: "Códigos de respaldo",
          backupCodesHint: "Solo se muestran una vez. Guarda estos códigos en un lugar seguro.",
          backupCodesEmpty: "Aún no tienes códigos de respaldo generados.",
          regenerateTitle: "Regenerar códigos",
          regenerateDescription: "Necesitas un código válido (app, correo o respaldo) para generar nuevos códigos.",
          regenerateCta: "Regenerar códigos",
          regenerated: "Códigos de respaldo regenerados. Guarda los nuevos.",
          enableFirst: "Activa MFA para gestionar códigos y respaldos.",
          disableTitle: "Desactivar MFA",
          disableDescription: "Introduce un código MFA válido para desactivar la autenticación en dos pasos.",
          disableCta: "Desactivar",
          disabledSuccess: "MFA desactivada. Tu cuenta ahora usa solo contraseña.",
          methodLabel: "Método",
          codeLabel: "Código",
          sendEmailCode: "Enviar código por correo",
          emailSent: "Código enviado. Revisa tu correo.",
          methods: {
            totp: "App (TOTP)",
            email: "Correo",
            backup: "Código de respaldo",
          },
        },
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
          changeEmail: "Change email",
          newEmailLabel: "New email",
          changeEmailCta: "Update email",
          hideEmailForm: "Close",
          startChange: "Send code",
          startHint: "Use an MFA code to send a code to the new email.",
          codeSent: "We sent a code to the new email.",
          codeLabel: "Code received",
          verifyEmail: "Confirm new email",
          emailUpdated: "Email updated and verified.",
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
          mfaRequired: "Enter an MFA code to confirm this change.",
          mfaMethod: "Method",
          mfaCode: "MFA code",
          sendEmail: "Send email code",
          emailSent: "Code sent. Check your inbox.",
          mfaLocked: "Too many attempts. Try again later.",
          mfaEnableFirst: "Enable MFA before changing the password.",
        },
        badges: {
          owner: "Owner",
          plan: "Plan",
        },
        headerHint: "Access & security",
        mfa: {
          heading: "Two-factor authentication",
          subtitle: "Add app or email codes to lock down your account.",
          statusEnabled: "Enabled",
          statusDisabled: "Disabled",
          setupCta: "Set up authenticator app",
          setupHint: "Scan the QR or copy the key into your app, then confirm a 6-digit code.",
          secretLabel: "Secret key",
          openInApp: "Open in app",
          copySecret: "Copy",
          copied: "Copied to clipboard.",
          confirmCta: "Confirm code",
          confirmPlaceholder: "6-digit code",
          enabledSuccess: "Two-factor authentication enabled. Save your backup codes.",
          genericError: "We couldn't complete this action. Please try again.",
          verifyEmailFirst: "Verify your email before configuring MFA.",
          backupCodesTitle: "Backup codes",
          backupCodesHint: "Shown only once. Store these codes somewhere safe.",
          backupCodesEmpty: "No backup codes yet. Generate them when you enable MFA.",
          regenerateTitle: "Regenerate codes",
          regenerateDescription: "Use a valid MFA code (app, email, or backup) to generate new backup codes.",
          regenerateCta: "Regenerate codes",
          regenerated: "Backup codes regenerated. Save the new list.",
          enableFirst: "Enable MFA to manage codes and backups.",
          disableTitle: "Disable MFA",
          disableDescription: "Enter a valid MFA code to turn off two-factor authentication.",
          disableCta: "Disable",
          disabledSuccess: "MFA disabled. Your account now uses password only.",
          methodLabel: "Method",
          codeLabel: "Code",
          sendEmailCode: "Send code via email",
          emailSent: "Code sent. Check your inbox.",
          methods: {
            totp: "App (TOTP)",
            email: "Email",
            backup: "Backup code",
          },
        },
      },
    }),
    [],
  )

  const t = copy[language]
  const mfaEnabled = !!authUser?.mfaEnabled
  const canChangePassword = !!authUser?.isOrgOwner && !!authUser?.emailVerified && mfaEnabled
  const disabledReason = !authUser?.isOrgOwner
    ? t.password.ownerOnly
    : !authUser?.emailVerified
      ? t.password.verifyFirst
      : !mfaEnabled
        ? t.password.mfaEnableFirst
        : ""

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
    setAuthUser(getAuthUser())
  }, [router])

  useEffect(() => {
    if (authUser?.mfaPreferredMethod) {
      setPasswordMfaMethod(authUser.mfaPreferredMethod as MfaMethod)
      setDisableMethod(authUser.mfaPreferredMethod as MfaMethod)
      setRegenMethod(authUser.mfaPreferredMethod as MfaMethod)
      setEmailChangeMethod(authUser.mfaPreferredMethod as MfaMethod)
    }
    if (authUser?.mfaEnabled) {
      setPasswordMfaRequired(true)
    }
  }, [authUser?.mfaPreferredMethod, authUser?.mfaEnabled])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setPasswordEmailMessage("")
    setPasswordEmailError(false)

    if (!authUser?.isOrgOwner) {
      setError(t.password.ownerOnly)
      return
    }

    if (!authUser.emailVerified) {
      setError(t.password.verifyFirst)
      return
    }

    if (passwordMfaNeeded && !passwordMfaCode) {
      setError(t.password.mfaRequired)
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
      await updateOwnerPassword(
        currentPassword,
        newPassword,
        passwordMfaNeeded ? { method: passwordMfaMethod, code: passwordMfaCode } : undefined,
      )
      setSuccess(t.password.success)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordMfaCode("")
      setPasswordMfaRequired(mfaEnabled)
      setAuthUser(getAuthUser())
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 423) {
          setError(t.password.mfaLocked)
          setPasswordMfaRequired(true)
        } else if (err.status === 403) {
          setError(t.password.mfaEnableFirst)
          setPasswordMfaRequired(true)
        } else {
          setError(err.message || t.password.genericError)
          if (err.status === 400) {
            setPasswordMfaRequired(true)
          }
        }
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

  const passwordMfaNeeded = mfaEnabled || passwordMfaRequired
  const handleStartTotpSetup = async () => {
    setMfaError("")
    setMfaSuccess("")
    setBackupCodes([])

    if (!authUser?.emailVerified) {
      setMfaError(t.mfa.verifyEmailFirst)
      return
    }

    setTotpLoading(true)
    try {
      const data = await startMfaTotpSetup()
      setTotpSetup(data)
    } catch (err: any) {
      if (err instanceof ApiError) {
        setMfaError(err.message || t.mfa.genericError)
      } else {
        setMfaError(t.mfa.genericError)
      }
    } finally {
      setTotpLoading(false)
    }
  }

  const handleConfirmTotp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMfaError("")
    setMfaSuccess("")
    setBackupCodes([])
    setTotpLoading(true)
    try {
      const data = await confirmMfaTotpSetup(totpCode)
      setBackupCodes(data.backup_codes ?? [])
      setMfaSuccess(t.mfa.enabledSuccess)
      setTotpSetup(null)
      setTotpCode("")
      setAuthUser(getAuthUser())
    } catch (err: any) {
      if (err instanceof ApiError) {
        setMfaError(err.message || t.mfa.genericError)
      } else {
        setMfaError(t.mfa.genericError)
      }
    } finally {
      setTotpLoading(false)
    }
  }

  const handleSendEmailOtp = async () => {
    setEmailOtpMessage("")
    setEmailOtpError(false)
    setSendingEmailOtp(true)
    try {
      await sendMfaEmailCode()
      setEmailOtpMessage(t.mfa.emailSent)
    } catch (err: any) {
      setEmailOtpError(true)
      setEmailOtpMessage(err.message || t.mfa.genericError)
    } finally {
      setSendingEmailOtp(false)
    }
  }

  const handleRegenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegenError("")
    setRegenSuccess("")
    setBackupCodes([])
    setRegenLoading(true)
    try {
      const data = await regenerateBackupCodes(regenMethod, regenCode)
      setBackupCodes(data.backup_codes ?? [])
      setRegenSuccess(t.mfa.regenerated)
      setRegenCode("")
      setAuthUser(getAuthUser())
    } catch (err: any) {
      if (err instanceof ApiError) {
        setRegenError(err.message || t.mfa.genericError)
      } else {
        setRegenError(t.mfa.genericError)
      }
    } finally {
      setRegenLoading(false)
    }
  }

  const handleDisableMfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setDisableError("")
    setDisableSuccess("")
    setDisableLoading(true)
    try {
      await disableMfa(disableMethod, disableCode)
      setDisableSuccess(t.mfa.disabledSuccess)
      setBackupCodes([])
      setTotpSetup(null)
      setDisableCode("")
      setAuthUser(getAuthUser())
    } catch (err: any) {
      if (err instanceof ApiError) {
        setDisableError(err.message || t.mfa.genericError)
      } else {
        setDisableError(t.mfa.genericError)
      }
    } finally {
      setDisableLoading(false)
    }
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setMfaSuccess(t.mfa.copied)
    } catch (err) {
      console.error("Failed to copy value", err)
    }
  }

  const handleSendPasswordEmailCode = async () => {
    setPasswordEmailMessage("")
    setPasswordEmailError(false)
    setPasswordEmailLoading(true)
    try {
      await sendMfaEmailCode()
      setPasswordEmailMessage(t.password.emailSent)
      setPasswordMfaMethod("email")
    } catch (err: any) {
      setPasswordEmailError(true)
      setPasswordEmailMessage(err.message || t.password.genericError)
    } finally {
      setPasswordEmailLoading(false)
    }
  }

  const handleStartEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailChangeMessage("")
    setEmailChangeError("")
    setEmailVerifySuccess("")
    setEmailVerifyError("")

    if (!newEmail) {
      setEmailChangeError(t.password.genericError)
      return
    }

    setEmailChangeLoading(true)
    try {
      await startEmailChange(newEmail, { method: emailChangeMethod, code: emailChangeMfaCode })
      setEmailChangeMessage(t.profile.codeSent)
      setEmailVerifyCode("")
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setEmailChangeError(t.password.mfaEnableFirst)
        } else if (err.status === 423) {
          setEmailChangeError(t.password.mfaLocked)
        } else {
          setEmailChangeError(err.message || t.password.genericError)
        }
      } else {
        setEmailChangeError(t.password.genericError)
      }
    } finally {
      setEmailChangeLoading(false)
    }
  }

  const handleVerifyEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailVerifyError("")
    setEmailVerifySuccess("")
    setEmailVerifyLoading(true)
    try {
      await verifyEmailChange(emailVerifyCode)
      setEmailVerifySuccess(t.profile.emailUpdated)
      setAuthUser(getAuthUser())
      setNewEmail("")
      setEmailChangeMfaCode("")
      setEmailChangeMessage("")
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 423) {
          setEmailVerifyError(t.password.mfaLocked)
        } else {
          setEmailVerifyError(err.message || t.password.genericError)
        }
      } else {
        setEmailVerifyError(t.password.genericError)
      }
    } finally {
      setEmailVerifyLoading(false)
    }
  }

  const renderMethodButtons = (
    selected: MfaMethod,
    onSelect: (method: MfaMethod) => void,
    options?: { disabled?: boolean },
  ) => (
    <div className="flex flex-wrap gap-2">
      {(["totp", "email", "backup"] as MfaMethod[]).map((method) => (
        <Button
          key={method}
          type="button"
          variant={selected === method ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(method)}
          disabled={options?.disabled}
        >
          {t.mfa.methods[method]}
        </Button>
      ))}
    </div>
  )

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

                  <div className="px-6 py-4 border-t border-border/70 bg-muted/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.profile.changeEmail}</p>
                          <p className="text-xs text-muted-foreground">{t.profile.startHint}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmailForm((prev) => !prev)}
                        className="gap-2"
                        disabled={!mfaEnabled}
                      >
                        {showEmailForm ? t.profile.hideEmailForm : t.profile.changeEmailCta}
                      </Button>
                    </div>

                    {showEmailForm && (
                      <>
                        {emailChangeError && (
                          <Alert variant="destructive" className="mt-3">
                            <AlertDescription>{emailChangeError}</AlertDescription>
                          </Alert>
                        )}
                        {emailChangeMessage && (
                          <Alert className="mt-3 border-green-200 bg-green-50 text-green-800">
                            <AlertDescription>{emailChangeMessage}</AlertDescription>
                          </Alert>
                        )}
                        {emailVerifySuccess && (
                          <Alert className="mt-3 border-green-200 bg-green-50 text-green-800">
                            <AlertDescription>{emailVerifySuccess}</AlertDescription>
                          </Alert>
                        )}
                        {emailVerifyError && (
                          <Alert variant="destructive" className="mt-3">
                            <AlertDescription>{emailVerifyError}</AlertDescription>
                          </Alert>
                        )}

                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <form
                            className="rounded-lg border border-border/70 bg-card p-4 space-y-3"
                            onSubmit={handleStartEmailChange}
                          >
                            <div className="space-y-2">
                              <Label htmlFor="new-email" className="text-xs text-muted-foreground">
                                {t.profile.newEmailLabel}
                              </Label>
                              <Input
                                id="new-email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                disabled={emailChangeLoading || !mfaEnabled}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">{t.password.mfaMethod}</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={handleSendPasswordEmailCode}
                                  disabled={passwordEmailLoading || !mfaEnabled}
                                >
                                  <Mail className="w-4 h-4" />
                                  {passwordEmailLoading ? t.password.submitting : t.password.sendEmail}
                                </Button>
                              </div>
                              {renderMethodButtons(emailChangeMethod, setEmailChangeMethod, {
                                disabled: emailChangeLoading || !mfaEnabled,
                              })}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email-change-mfa" className="text-xs text-muted-foreground">
                                {t.password.mfaCode}
                              </Label>
                              <Input
                                id="email-change-mfa"
                                value={emailChangeMfaCode}
                                onChange={(e) => setEmailChangeMfaCode(e.target.value)}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={10}
                                required
                                disabled={emailChangeLoading || !mfaEnabled}
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={
                                emailChangeLoading || !mfaEnabled || !newEmail || !emailChangeMfaCode
                              }
                              className="w-full"
                            >
                              {emailChangeLoading ? t.password.submitting : t.profile.startChange}
                            </Button>
                            {!mfaEnabled && (
                              <p className="text-[11px] text-muted-foreground">{t.password.mfaEnableFirst}</p>
                            )}
                          </form>

                          <form
                            className="rounded-lg border border-border/70 bg-card p-4 space-y-3"
                            onSubmit={handleVerifyEmailChange}
                          >
                            <div className="space-y-2">
                              <Label htmlFor="email-verify-code" className="text-xs text-muted-foreground">
                                {t.profile.codeLabel}
                              </Label>
                              <Input
                                id="email-verify-code"
                                value={emailVerifyCode}
                                onChange={(e) => setEmailVerifyCode(e.target.value)}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                required
                                disabled={emailVerifyLoading}
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={emailVerifyLoading || !emailVerifyCode}
                              className="w-full"
                            >
                              {emailVerifyLoading ? t.password.submitting : t.profile.verifyEmail}
                            </Button>
                          </form>
                        </div>
                      </>
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
                          {passwordMfaNeeded && (
                            <div className="space-y-2 border-t border-border/80 pt-4 mt-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">{t.password.mfaMethod}</Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSendPasswordEmailCode}
                                    disabled={passwordEmailLoading}
                                    className="gap-2"
                                  >
                                    <Mail className="w-4 h-4" />
                                    {passwordEmailLoading ? t.password.submitting : t.password.sendEmail}
                                  </Button>
                                </div>
                              </div>
                              {renderMethodButtons(passwordMfaMethod, setPasswordMfaMethod, {
                                disabled: loading,
                              })}
                              <div className="space-y-2">
                                <Label htmlFor="password-mfa-code" className="text-xs text-muted-foreground">
                                  {t.password.mfaCode}
                                </Label>
                                <Input
                                  id="password-mfa-code"
                                  value={passwordMfaCode}
                                  onChange={(e) => setPasswordMfaCode(e.target.value)}
                                  inputMode="numeric"
                                  autoComplete="one-time-code"
                                  maxLength={10}
                                  disabled={loading}
                                  required={passwordMfaNeeded}
                                />
                              </div>
                              {passwordEmailMessage && (
                                <Alert
                                  variant={passwordEmailError ? "destructive" : "default"}
                                  className={
                                    passwordEmailError ? undefined : "border-green-200 bg-green-50 text-green-800"
                                  }
                                >
                                  <AlertDescription>{passwordEmailMessage}</AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !canChangePassword || (passwordMfaNeeded && !passwordMfaCode)}
                          >
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

            <Card className="rounded-2xl shadow-sm border-border/70 bg-card">
              <CardContent className="p-0">
                <div className="px-6 py-5 bg-muted/60 border-b border-border/70 rounded-t-2xl">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{t.mfa.heading}</p>
                      <p className="text-xs text-muted-foreground">{t.mfa.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={mfaEnabled ? "secondary" : "outline"}
                        className={mfaEnabled ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                      >
                        {mfaEnabled ? t.mfa.statusEnabled : t.mfa.statusDisabled}
                      </Badge>
                      {authUser?.mfaPreferredMethod && (
                        <Badge variant="outline" className="border-border/70 text-foreground">
                          {t.mfa.methods[authUser.mfaPreferredMethod as MfaMethod]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {!authUser?.emailVerified && (
                    <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-900">
                      <AlertDescription>{t.mfa.verifyEmailFirst}</AlertDescription>
                    </Alert>
                  )}
                  {mfaError && (
                    <Alert variant="destructive">
                      <AlertDescription>{mfaError}</AlertDescription>
                    </Alert>
                  )}
                  {mfaSuccess && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <AlertDescription>{mfaSuccess}</AlertDescription>
                    </Alert>
                  )}
                  {emailOtpMessage && (
                    <Alert
                      variant={emailOtpError ? "destructive" : "default"}
                      className={
                        emailOtpError ? undefined : "border-green-200 bg-green-50 text-green-800"
                      }
                    >
                      <AlertDescription>{emailOtpMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.mfa.setupCta}</p>
                          <p className="text-xs text-muted-foreground">{t.mfa.setupHint}</p>
                        </div>
                      </div>
                      {!totpSetup && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleStartTotpSetup}
                          disabled={totpLoading || mfaEnabled || !authUser?.emailVerified}
                          className="gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          {totpLoading ? t.password.submitting : t.mfa.setupCta}
                        </Button>
                      )}
                    </div>

                    {totpSetup && (
                      <div className="space-y-3 rounded-lg border border-border/80 bg-card px-4 py-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-foreground">{totpSetup.issuer}</p>
                            <p className="text-xs text-muted-foreground">{totpSetup.account_name}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              type="button"
                              onClick={() => handleCopy(totpSetup.secret)}
                            >
                              <Copy className="w-4 h-4" />
                              {t.mfa.copySecret}
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="gap-2"
                              type="button"
                              onClick={() => window.open(totpSetup.otpauth_url, "_blank")}
                            >
                              <QrCode className="w-4 h-4" />
                              {t.mfa.openInApp}
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[2fr,1fr] md:items-center">
                          <div className="rounded-lg bg-muted/70 border px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                              {t.mfa.secretLabel}
                            </p>
                            <p className="font-mono text-sm break-all text-foreground">{totpSetup.secret}</p>
                          </div>
                          <div className="flex items-center justify-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(totpSetup.otpauth_url)}`}
                              alt="TOTP QR"
                              className="w-44 h-44 rounded-lg border bg-white object-contain"
                            />
                          </div>
                        </div>

                        <form className="space-y-2" onSubmit={handleConfirmTotp}>
                          <Label htmlFor="totp-code" className="text-xs text-muted-foreground">
                            {t.mfa.confirmCta}
                          </Label>
                          <Input
                            id="totp-code"
                            value={totpCode}
                            onChange={(e) => setTotpCode(e.target.value)}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            required
                            disabled={totpLoading}
                          />
                          <Button type="submit" disabled={totpLoading || totpCode.length < 6}>
                            {totpLoading ? t.password.submitting : t.mfa.confirmCta}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.mfa.backupCodesTitle}</p>
                          <p className="text-xs text-muted-foreground">{t.mfa.backupCodesHint}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleSendEmailOtp}
                        disabled={sendingEmailOtp}
                        className="gap-2"
                      >
                        <MailCheck className="w-4 h-4" />
                        {sendingEmailOtp ? t.password.submitting : t.mfa.sendEmailCode}
                      </Button>
                    </div>

                    {backupCodes.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {backupCodes.map((code) => (
                          <div
                            key={code}
                            className="rounded-lg bg-card border px-3 py-2 text-sm font-mono text-foreground"
                          >
                            {code}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">{t.mfa.backupCodesEmpty}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <form
                      className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3"
                      onSubmit={handleRegenerateCodes}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.mfa.regenerateTitle}</p>
                          <p className="text-xs text-muted-foreground">{t.mfa.regenerateDescription}</p>
                        </div>
                      </div>
                      {regenError && (
                        <Alert variant="destructive">
                          <AlertDescription>{regenError}</AlertDescription>
                        </Alert>
                      )}
                      {regenSuccess && (
                        <Alert className="border-green-200 bg-green-50 text-green-800">
                          <AlertDescription>{regenSuccess}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.mfa.methodLabel}</Label>
                        {renderMethodButtons(regenMethod, setRegenMethod, { disabled: !mfaEnabled })}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regen-code" className="text-xs text-muted-foreground">
                          {t.mfa.codeLabel}
                        </Label>
                        <Input
                          id="regen-code"
                          value={regenCode}
                          onChange={(e) => setRegenCode(e.target.value)}
                          required
                          disabled={!mfaEnabled || regenLoading}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSendEmailOtp}
                          disabled={sendingEmailOtp}
                          className="gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {sendingEmailOtp ? t.password.submitting : t.mfa.sendEmailCode}
                        </Button>
                        <Button type="submit" disabled={regenLoading || !mfaEnabled || !regenCode}>
                          {regenLoading ? t.password.submitting : t.mfa.regenerateCta}
                        </Button>
                      </div>
                      {!mfaEnabled && (
                        <p className="text-[11px] text-muted-foreground">
                          {t.mfa.enableFirst}
                        </p>
                      )}
                    </form>

                    <form
                      className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3"
                      onSubmit={handleDisableMfa}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                          <ShieldOff className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.mfa.disableTitle}</p>
                          <p className="text-xs text-muted-foreground">{t.mfa.disableDescription}</p>
                        </div>
                      </div>
                      {disableError && (
                        <Alert variant="destructive">
                          <AlertDescription>{disableError}</AlertDescription>
                        </Alert>
                      )}
                      {disableSuccess && (
                        <Alert className="border-green-200 bg-green-50 text-green-800">
                          <AlertDescription>{disableSuccess}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.mfa.methodLabel}</Label>
                        {renderMethodButtons(disableMethod, setDisableMethod, { disabled: !mfaEnabled })}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disable-code" className="text-xs text-muted-foreground">
                          {t.mfa.codeLabel}
                        </Label>
                        <Input
                          id="disable-code"
                          value={disableCode}
                          onChange={(e) => setDisableCode(e.target.value)}
                          required
                          disabled={!mfaEnabled || disableLoading}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSendEmailOtp}
                          disabled={sendingEmailOtp}
                          className="gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {sendingEmailOtp ? t.password.submitting : t.mfa.sendEmailCode}
                        </Button>
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={disableLoading || !mfaEnabled || !disableCode}
                        >
                          {disableLoading ? t.password.submitting : t.mfa.disableCta}
                        </Button>
                      </div>
                      {!mfaEnabled && (
                        <p className="text-[11px] text-muted-foreground">{t.mfa.enableFirst}</p>
                      )}
                    </form>
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
