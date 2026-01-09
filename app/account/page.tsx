"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
  getRecoveryEmailStatus,
  requestRecoveryEmail,
  verifyRecoveryEmail,
  resendRecoveryEmail,
  removeRecoveryEmail,
  type RecoveryEmailStatus,
  type MfaMethod,
} from "@/lib/api"
import { getAuthToken, getAuthUser, type AuthUser } from "@/lib/auth"
import { useLanguage } from "@/components/language-provider"
import {
  BadgeCheck,
  CalendarClock,
  ChevronDown,
  ChevronRight,
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
  LifeBuoy,
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
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryEmailStatus | null>(null)
  const [recoveryStatusError, setRecoveryStatusError] = useState("")
  const [recoveryStatusLoading, setRecoveryStatusLoading] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoveryPassword, setRecoveryPassword] = useState("")
  const [recoveryMethod, setRecoveryMethod] = useState<MfaMethod>("totp")
  const [recoveryMfaCode, setRecoveryMfaCode] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [recoveryRequestLoading, setRecoveryRequestLoading] = useState(false)
  const [recoveryVerifyLoading, setRecoveryVerifyLoading] = useState(false)
  const [recoveryResendLoading, setRecoveryResendLoading] = useState(false)
  const [recoveryRemoveLoading, setRecoveryRemoveLoading] = useState(false)
  const [recoveryRequestMessage, setRecoveryRequestMessage] = useState("")
  const [recoveryRequestError, setRecoveryRequestError] = useState("")
  const [recoveryVerifyMessage, setRecoveryVerifyMessage] = useState("")
  const [recoveryVerifyError, setRecoveryVerifyError] = useState("")
  const [recoveryResendMessage, setRecoveryResendMessage] = useState("")
  const [recoveryResendError, setRecoveryResendError] = useState("")
  const [recoveryRemoveMessage, setRecoveryRemoveMessage] = useState("")
  const [recoveryRemoveError, setRecoveryRemoveError] = useState("")
  const [removeMethod, setRemoveMethod] = useState<MfaMethod>("totp")
  const [removeMfaCode, setRemoveMfaCode] = useState("")
  const [removePassword, setRemovePassword] = useState("")
  const [recoveryEmailOtpMessage, setRecoveryEmailOtpMessage] = useState("")
  const [recoveryEmailOtpError, setRecoveryEmailOtpError] = useState(false)
  const [recoveryEmailOtpLoading, setRecoveryEmailOtpLoading] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [mfaOpen, setMfaOpen] = useState(false)

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
        recovery: {
          heading: "Correo de recuperación",
          subtitle: "Agrega un correo de respaldo para recuperar el acceso si pierdes MFA o el inbox principal.",
          missing: "Aún no tienes correo de recuperación.",
          pending: "Pendiente de verificación",
          verified: "Correo de recuperación verificado",
          currentLabel: "Correo de recuperación",
          pendingLabel: "Correo pendiente",
          newEmailLabel: "Nuevo correo de recuperación",
          requestCta: "Enviar código",
          requesting: "Enviando...",
          requestSent: "Enviamos un código a tu correo de recuperación. Caduca en 15 minutos.",
          codeLabel: "Código de verificación",
          verifyCta: "Confirmar código",
          verifySuccess: "Correo de recuperación verificado.",
          resendCta: "Reenviar código",
          resendSuccess: "Reenviamos el código. Revisa tu bandeja.",
          removeTitle: "Quitar correo de recuperación",
          removeCta: "Quitar",
          removed: "Correo de recuperación eliminado.",
          passwordLabel: "Contraseña",
          passwordRequired: "Ingresa tu contraseña para continuar.",
          mfaRequired: "Activa MFA para actualizar o eliminar el correo de recuperación.",
          stepUpHint: "Confirma esta acción con MFA o tu contraseña.",
          challengeMissing: "No hay un challenge activo. Inicia uno nuevo enviando un código.",
          restart: "Reiniciar",
          addReminder: "Agrega un correo de recuperación para agilizar el acceso si pierdes tus códigos.",
          cooldownHint: "Códigos válidos por 15 minutos. Puedes reenviar cada 60s.",
          pendingHelp: "Ingresa el código de 6 dígitos que enviamos.",
          emailOtpSent: "Código enviado a tu correo. Revisa tu bandeja.",
          genericError: "No pudimos completar esta acción. Intenta nuevamente.",
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
        recovery: {
          heading: "Recovery email",
          subtitle: "Add a backup email to regain access if you lose MFA or your main inbox.",
          missing: "No recovery email yet.",
          pending: "Pending verification",
          verified: "Recovery email verified",
          currentLabel: "Recovery email",
          pendingLabel: "Pending email",
          newEmailLabel: "Recovery email",
          requestCta: "Send code",
          requesting: "Sending...",
          requestSent: "We sent a code to your recovery email. It expires in 15 minutes.",
          codeLabel: "Verification code",
          verifyCta: "Confirm code",
          verifySuccess: "Recovery email verified.",
          resendCta: "Resend code",
          resendSuccess: "Code resent. Check your inbox.",
          removeTitle: "Remove recovery email",
          removeCta: "Remove",
          removed: "Recovery email removed.",
          passwordLabel: "Password",
          passwordRequired: "Enter your password to continue.",
          mfaRequired: "Enable MFA to update or remove the recovery email.",
          stepUpHint: "Confirm this action with MFA or your password.",
          challengeMissing: "No active challenge. Start again by sending a new code.",
          restart: "Start over",
          addReminder: "Add a recovery email to speed up account recovery.",
          cooldownHint: "Codes last 15 minutes; resend every 60s.",
          pendingHelp: "Enter the 6-digit code we sent.",
          emailOtpSent: "Code sent to your email. Check your inbox.",
          genericError: "We couldn't complete this action. Please try again.",
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
      setRecoveryMethod(authUser.mfaPreferredMethod as MfaMethod)
      setRemoveMethod(authUser.mfaPreferredMethod as MfaMethod)
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
  const recoveryChangesBlocked = !!recoveryStatus?.mfa_required_for_changes && !mfaEnabled
  const recoveryPendingChallenge = !!recoveryStatus?.pending_challenge
  const recoveryEmailMasked = recoveryStatus?.recovery_email_masked
  const pendingRecoveryEmailMasked = recoveryStatus?.pending_email_masked
  const hasRecoveryTarget = recoveryStatus?.recovery_email_present || recoveryPendingChallenge
  const recoveryStatusLabel = recoveryStatus?.recovery_email_verified
    ? t.recovery.verified
    : recoveryPendingChallenge
      ? t.recovery.pending
      : t.recovery.missing
  const recoveryBadgeClass = recoveryStatus?.recovery_email_verified
    ? "bg-emerald-600 text-white hover:bg-emerald-700"
    : recoveryPendingChallenge
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-slate-100 border-slate-200 text-slate-700"

  const fetchRecoveryStatus = useCallback(
    async (options?: { silent?: boolean }) => {
      setRecoveryStatusError("")
      if (!options?.silent) {
        setRecoveryStatusLoading(true)
      }
      try {
        const data = await getRecoveryEmailStatus()
        setRecoveryStatus(data)
      } catch (err: any) {
        setRecoveryStatusError(
          err instanceof ApiError ? err.message || t.recovery.genericError : t.recovery.genericError,
        )
      } finally {
        if (!options?.silent) {
          setRecoveryStatusLoading(false)
        }
      }
    },
    [t.recovery.genericError],
  )

  useEffect(() => {
    if (authUser) {
      fetchRecoveryStatus()
    }
  }, [authUser, fetchRecoveryStatus])

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

  const handleSendRecoveryEmailOtp = async () => {
    setRecoveryEmailOtpMessage("")
    setRecoveryEmailOtpError(false)
    setRecoveryEmailOtpLoading(true)
    try {
      await sendMfaEmailCode()
      setRecoveryEmailOtpMessage(t.recovery.emailOtpSent)
      setRecoveryMethod("email")
      setRemoveMethod("email")
    } catch (err: any) {
      setRecoveryEmailOtpError(true)
      setRecoveryEmailOtpMessage(err.message || t.recovery.genericError)
    } finally {
      setRecoveryEmailOtpLoading(false)
    }
  }

  const handleRequestRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryRequestError("")
    setRecoveryRequestMessage("")
    setRecoveryVerifyMessage("")
    setRecoveryVerifyError("")

    if (recoveryChangesBlocked) {
      setRecoveryRequestError(t.recovery.mfaRequired)
      return
    }

    if (!recoveryEmail) {
      setRecoveryRequestError(t.recovery.genericError)
      return
    }

    const payload: Record<string, any> = {}
    if (mfaEnabled) {
      if (!recoveryMfaCode) {
        setRecoveryRequestError(t.password.mfaRequired)
        return
      }
      payload.method = recoveryMethod
      payload.code = recoveryMfaCode
    } else {
      if (!recoveryPassword) {
        setRecoveryRequestError(t.recovery.passwordRequired)
        return
      }
      payload.password = recoveryPassword
    }

    setRecoveryRequestLoading(true)
    try {
      await requestRecoveryEmail(recoveryEmail, payload)
      setRecoveryRequestMessage(t.recovery.requestSent)
      setRecoveryPassword("")
      setRecoveryMfaCode("")
      await fetchRecoveryStatus({ silent: true })
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403 && recoveryChangesBlocked) {
          setRecoveryRequestError(t.recovery.mfaRequired)
        } else {
          setRecoveryRequestError(err.message || t.recovery.genericError)
        }
      } else {
        setRecoveryRequestError(t.recovery.genericError)
      }
    } finally {
      setRecoveryRequestLoading(false)
    }
  }

  const handleVerifyRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryVerifyError("")
    setRecoveryVerifyMessage("")
    setRecoveryResendMessage("")
    setRecoveryResendError("")
    setRecoveryVerifyLoading(true)
    try {
      await verifyRecoveryEmail(recoveryCode)
      setRecoveryVerifyMessage(t.recovery.verifySuccess)
      setRecoveryCode("")
      await fetchRecoveryStatus({ silent: true })
    } catch (err: any) {
      if (err instanceof ApiError && [400, 423, 429].includes(err.status)) {
        setRecoveryVerifyError(err.message || t.recovery.genericError)
      } else if (err instanceof ApiError) {
        setRecoveryVerifyError(err.message || t.recovery.genericError)
      } else {
        setRecoveryVerifyError(t.recovery.genericError)
      }
    } finally {
      setRecoveryVerifyLoading(false)
    }
  }

  const handleResendRecoveryEmail = async () => {
    setRecoveryResendError("")
    setRecoveryResendMessage("")
    setRecoveryVerifyError("")
    setRecoveryEmailOtpMessage("")
    setRecoveryEmailOtpError(false)
    setRecoveryResendLoading(true)
    try {
      await resendRecoveryEmail()
      setRecoveryResendMessage(t.recovery.resendSuccess)
      await fetchRecoveryStatus({ silent: true })
    } catch (err: any) {
      if (err instanceof ApiError && [400, 423, 429].includes(err.status)) {
        setRecoveryResendError(err.message || t.recovery.genericError)
      } else if (err instanceof ApiError) {
        setRecoveryResendError(err.message || t.recovery.genericError)
      } else {
        setRecoveryResendError(t.recovery.genericError)
      }
    } finally {
      setRecoveryResendLoading(false)
    }
  }

  const handleRemoveRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryRemoveError("")
    setRecoveryRemoveMessage("")

    if (recoveryChangesBlocked) {
      setRecoveryRemoveError(t.recovery.mfaRequired)
      return
    }

    const payload: Record<string, any> = {}
    if (mfaEnabled) {
      if (!removeMfaCode) {
        setRecoveryRemoveError(t.password.mfaRequired)
        return
      }
      payload.method = removeMethod
      payload.code = removeMfaCode
    } else {
      if (!removePassword) {
        setRecoveryRemoveError(t.recovery.passwordRequired)
        return
      }
      payload.password = removePassword
    }

    setRecoveryRemoveLoading(true)
    try {
      const result = await removeRecoveryEmail(payload)
      setRecoveryRemoveMessage(
        result?.status === "no_recovery_email" ? t.recovery.missing : t.recovery.removed,
      )
      setRemoveMfaCode("")
      setRemovePassword("")
      await fetchRecoveryStatus({ silent: true })
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setRecoveryRemoveError(t.recovery.mfaRequired)
        } else if (err.status === 423) {
          setRecoveryRemoveError(t.password.mfaLocked)
        } else {
          setRecoveryRemoveError(err.message || t.recovery.genericError)
        }
      } else {
        setRecoveryRemoveError(t.recovery.genericError)
      }
    } finally {
      setRecoveryRemoveLoading(false)
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
                  <div className="flex items-center justify-between gap-3 flex-wrap">
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setProfileOpen((prev) => !prev)}
                        aria-expanded={profileOpen}
                      >
                        {profileOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {profileOpen && (
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
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border/70 bg-card">
              <CardContent className="p-0">
                <div className="px-6 py-5 bg-muted/60 border-b border-border/70 rounded-t-2xl">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{t.recovery.heading}</p>
                      <p className="text-xs text-muted-foreground">{t.recovery.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Badge variant="outline" className={recoveryBadgeClass}>
                        {recoveryStatusLabel}
                      </Badge>
                      {recoveryEmailMasked && (
                        <span className="text-xs text-muted-foreground">
                          {t.recovery.currentLabel}: {recoveryEmailMasked}
                        </span>
                      )}
                      {pendingRecoveryEmailMasked && (
                        <span className="text-xs text-muted-foreground">
                          {t.recovery.pendingLabel}: {pendingRecoveryEmailMasked}
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setRecoveryOpen((prev) => !prev)}
                        aria-expanded={recoveryOpen}
                      >
                        {recoveryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                {recoveryOpen && (
                  <div className="p-6 space-y-4">
                    {recoveryStatusError && (
                      <Alert variant="destructive">
                        <AlertDescription>{recoveryStatusError}</AlertDescription>
                      </Alert>
                    )}
                    {recoveryStatusLoading && (
                      <p className="text-xs text-muted-foreground">{t.password.submitting}</p>
                    )}
                    {!recoveryStatusLoading && !recoveryStatus?.recovery_email_present && (
                      <Alert className="bg-slate-100 border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50">
                        <AlertDescription>{t.recovery.addReminder}</AlertDescription>
                      </Alert>
                    )}
                    {recoveryChangesBlocked && (
                      <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-900">
                        <AlertDescription>{t.recovery.mfaRequired}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      <form
                        className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-3"
                        onSubmit={handleRequestRecoveryEmail}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                            <LifeBuoy className="w-5 h-5 text-sky-600 dark:text-sky-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t.recovery.heading}</p>
                            <p className="text-[11px] text-muted-foreground">{t.recovery.stepUpHint}</p>
                          </div>
                        </div>
                        {recoveryRequestError && (
                          <Alert variant="destructive">
                            <AlertDescription>{recoveryRequestError}</AlertDescription>
                          </Alert>
                        )}
                        {recoveryRequestMessage && (
                          <Alert className="border-green-200 bg-green-50 text-green-800">
                            <AlertDescription>{recoveryRequestMessage}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="recovery-email" className="text-xs text-muted-foreground">
                            {t.recovery.newEmailLabel}
                          </Label>
                          <Input
                            id="recovery-email"
                            type="email"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            required
                            disabled={recoveryRequestLoading || recoveryChangesBlocked}
                          />
                        </div>
                        {mfaEnabled ? (
                          <>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">{t.password.mfaMethod}</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={handleSendRecoveryEmailOtp}
                                disabled={recoveryEmailOtpLoading || recoveryChangesBlocked}
                              >
                                <Mail className="w-4 h-4" />
                                {recoveryEmailOtpLoading ? t.password.submitting : t.mfa.sendEmailCode}
                              </Button>
                            </div>
                            {renderMethodButtons(recoveryMethod, setRecoveryMethod, {
                              disabled: recoveryRequestLoading || recoveryChangesBlocked,
                            })}
                            <div className="space-y-2">
                              <Label htmlFor="recovery-mfa-code" className="text-xs text-muted-foreground">
                                {t.password.mfaCode}
                              </Label>
                              <Input
                                id="recovery-mfa-code"
                                value={recoveryMfaCode}
                                onChange={(e) => setRecoveryMfaCode(e.target.value)}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={10}
                                disabled={recoveryRequestLoading || recoveryChangesBlocked}
                                required={mfaEnabled}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="recovery-password" className="text-xs text-muted-foreground">
                              {t.recovery.passwordLabel}
                            </Label>
                            <Input
                              id="recovery-password"
                              type="password"
                              value={recoveryPassword}
                              onChange={(e) => setRecoveryPassword(e.target.value)}
                              disabled={recoveryRequestLoading || recoveryChangesBlocked}
                              required
                            />
                          </div>
                        )}
                        {recoveryEmailOtpMessage && (
                          <Alert
                            variant={recoveryEmailOtpError ? "destructive" : "default"}
                            className={
                              recoveryEmailOtpError ? undefined : "border-green-200 bg-green-50 text-green-800"
                            }
                          >
                            <AlertDescription>{recoveryEmailOtpMessage}</AlertDescription>
                          </Alert>
                        )}
                        <Button
                          type="submit"
                          disabled={
                            recoveryRequestLoading ||
                            recoveryChangesBlocked ||
                            !recoveryEmail ||
                            (mfaEnabled ? !recoveryMfaCode : !recoveryPassword)
                          }
                          className="w-full"
                        >
                          {recoveryRequestLoading ? t.recovery.requesting : t.recovery.requestCta}
                        </Button>
                        <p className="text-[11px] text-muted-foreground">{t.recovery.cooldownHint}</p>
                      </form>

                      <div className="space-y-4">
                        <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {recoveryPendingChallenge ? t.recovery.pending : t.recovery.challengeMissing}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {recoveryPendingChallenge
                                  ? pendingRecoveryEmailMasked
                                    ? `${t.recovery.pendingLabel}: ${pendingRecoveryEmailMasked}`
                                    : t.recovery.pendingHelp
                                  : t.recovery.challengeMissing}
                              </p>
                            </div>
                          </div>
                          {recoveryVerifyError && (
                            <Alert variant="destructive">
                              <AlertDescription>{recoveryVerifyError}</AlertDescription>
                            </Alert>
                          )}
                          {recoveryVerifyMessage && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                              <AlertDescription>{recoveryVerifyMessage}</AlertDescription>
                            </Alert>
                          )}
                          {recoveryResendError && (
                            <Alert variant="destructive">
                              <AlertDescription>{recoveryResendError}</AlertDescription>
                            </Alert>
                          )}
                          {recoveryResendMessage && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                              <AlertDescription>{recoveryResendMessage}</AlertDescription>
                            </Alert>
                          )}
                          <form className="space-y-3" onSubmit={handleVerifyRecoveryEmail}>
                            <div className="space-y-2">
                              <Label htmlFor="recovery-code" className="text-xs text-muted-foreground">
                                {t.recovery.codeLabel}
                              </Label>
                              <Input
                                id="recovery-code"
                                value={recoveryCode}
                                onChange={(e) => setRecoveryCode(e.target.value)}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                disabled={recoveryVerifyLoading}
                                required
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="submit" disabled={recoveryVerifyLoading || !recoveryCode}>
                                {recoveryVerifyLoading ? t.password.submitting : t.recovery.verifyCta}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleResendRecoveryEmail}
                                disabled={recoveryResendLoading}
                              >
                                {recoveryResendLoading ? t.password.submitting : t.recovery.resendCta}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setRecoveryCode("")
                                  fetchRecoveryStatus()
                                }}
                              >
                                {t.recovery.restart}
                              </Button>
                            </div>
                          </form>
                        </div>

                        <form
                          className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3"
                          onSubmit={handleRemoveRecoveryEmail}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                              <ShieldOff className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{t.recovery.removeTitle}</p>
                              <p className="text-xs text-muted-foreground">{t.recovery.stepUpHint}</p>
                            </div>
                          </div>
                          {recoveryRemoveError && (
                            <Alert variant="destructive">
                              <AlertDescription>{recoveryRemoveError}</AlertDescription>
                            </Alert>
                          )}
                          {recoveryRemoveMessage && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                              <AlertDescription>{recoveryRemoveMessage}</AlertDescription>
                            </Alert>
                          )}
                          {mfaEnabled ? (
                            <>
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">{t.password.mfaMethod}</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={handleSendRecoveryEmailOtp}
                                  disabled={recoveryEmailOtpLoading || recoveryChangesBlocked}
                                >
                                  <Mail className="w-4 h-4" />
                                  {recoveryEmailOtpLoading ? t.password.submitting : t.mfa.sendEmailCode}
                                </Button>
                              </div>
                              {renderMethodButtons(removeMethod, setRemoveMethod, {
                                disabled: recoveryRemoveLoading || recoveryChangesBlocked,
                              })}
                              <div className="space-y-2">
                                <Label htmlFor="remove-mfa-code" className="text-xs text-muted-foreground">
                                  {t.password.mfaCode}
                                </Label>
                                <Input
                                  id="remove-mfa-code"
                                  value={removeMfaCode}
                                  onChange={(e) => setRemoveMfaCode(e.target.value)}
                                  inputMode="numeric"
                                  autoComplete="one-time-code"
                                  maxLength={10}
                                  disabled={recoveryRemoveLoading || recoveryChangesBlocked}
                                  required={mfaEnabled}
                                />
                              </div>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <Label htmlFor="remove-password" className="text-xs text-muted-foreground">
                                {t.recovery.passwordLabel}
                              </Label>
                              <Input
                                id="remove-password"
                                type="password"
                                value={removePassword}
                                onChange={(e) => setRemovePassword(e.target.value)}
                                disabled={recoveryRemoveLoading || recoveryChangesBlocked}
                                required
                              />
                            </div>
                          )}
                          <Button
                            type="submit"
                            variant="destructive"
                            disabled={
                              recoveryRemoveLoading ||
                              recoveryChangesBlocked ||
                              !hasRecoveryTarget ||
                              (mfaEnabled ? !removeMfaCode : !removePassword)
                            }
                          >
                            {recoveryRemoveLoading ? t.password.submitting : t.recovery.removeCta}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setMfaOpen((prev) => !prev)}
                        aria-expanded={mfaOpen}
                      >
                        {mfaOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {mfaOpen && (
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
