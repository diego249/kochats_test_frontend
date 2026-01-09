// lib/api.ts

import { getAuthToken, getApiUrl, setAuthToken, setAuthUser, updateAuthUser, type AuthUser } from "./auth"

export class ApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

type RequestInit = {
  method?: string
  headers?: Record<string, string>
  body?: string
  skipAuthRedirect?: boolean
}

function mapSessionToAuthUser(data: any): AuthUser {
  return {
    token: data.token,
    username: data.username,
    email: data.email,
    userType: data.user_type,
    organizationId: data.organization?.id ?? data.organization_id ?? null,
    organizationName: data.organization?.name ?? data.organization_name ?? null,
    isOrgOwner: !!data.is_org_owner,
    plan: data.plan ?? data.plan_code ?? null,
    emailVerified: !!data.email_verified,
    verificationRequired: data.verification_required ?? data.verificationRequired,
    emailVerifiedAt: data.email_verified_at ?? data.emailVerifiedAt ?? null,
    mfaEnabled: !!data.mfa_enabled,
    mfaPreferredMethod: data.mfa_preferred_method ?? data.preferred_method ?? data.preferredMethod ?? null,
    mfaCompletedAt: data.mfa_completed_at ?? null,
    pendingEmail: data.pending_email ?? null,
  }
}

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${getApiUrl()}${endpoint}`
  const token = getAuthToken()
  const { skipAuthRedirect, ...fetchOptions } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Token ${token}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    if (!skipAuthRedirect && typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
      localStorage.removeItem("pendingVerificationPath")
      window.location.href = "/login"
    }
    throw new ApiError("Unauthorized", 401)
  }

  if (response.status === 204) {
    return {} as T
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const detail = error.detail || error.message || `API error: ${response.status}`

    if (
      response.status === 403 &&
      detail === "Debes verificar tu email para realizar esta acción." &&
      typeof window !== "undefined"
    ) {
      try {
        const pendingPath = `${window.location.pathname}${window.location.search}`
        localStorage.setItem("pendingVerificationPath", pendingPath)
      } catch (err) {
        console.error("Failed to persist pending verification path", err)
      }
      window.location.href = "/verify-email"
    }

    throw new ApiError(detail, response.status, error)
  }

  return response.json()
}

// =========================
// Auth endpoints
// =========================

export async function login(username: string, password: string) {
  const data = await apiCall<any>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  if (data?.mfa_required) {
    return data
  }

  const authUser: AuthUser = mapSessionToAuthUser(data)

  setAuthToken(authUser.token)
  setAuthUser(authUser)

  return data
}

export async function register(email: string, username: string, password: string, planCode?: string) {
  const data = await apiCall<any>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      email,
      username,
      password,
      ...(planCode ? { plan_code: planCode } : {}),
    }),
  })

  const authUser: AuthUser = mapSessionToAuthUser(data)

  setAuthToken(authUser.token)
  setAuthUser(authUser)

  return data
}

export function logout() {
  return apiCall("/api/auth/logout/", {
    method: "POST",
  })
}

export function verifyEmail(email: string, code: string) {
  return apiCall("/api/auth/verify-email/", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  })
}

export function resendVerification(email: string) {
  return apiCall("/api/auth/resend-verification/", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

// =========================
// Password reset endpoints
// =========================

export type PasswordResetValidation = {
  valid: boolean
  mfa_required?: boolean
  methods?: MfaMethod[]
}

export function requestPasswordReset(email: string) {
  return apiCall<{ ok: boolean }>("/api/auth/password-reset/request/", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuthRedirect: true,
  })
}

export function validatePasswordReset(token: string) {
  return apiCall<PasswordResetValidation>("/api/auth/password-reset/validate/", {
    method: "POST",
    body: JSON.stringify({ token }),
    skipAuthRedirect: true,
  })
}

export function confirmPasswordReset(
  token: string,
  newPassword: string,
  options?: { method?: MfaMethod; code?: string },
) {
  const payload: Record<string, any> = {
    token,
    new_password: newPassword,
  }

  if (options?.method && options.code) {
    payload.mfa = {
      method: options.method,
      code: options.code,
    }
  }

  return apiCall<{ ok: boolean }>("/api/auth/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuthRedirect: true,
  })
}

// =========================
// MFA endpoints
// =========================

export type MfaMethod = "totp" | "email" | "backup"

export function startMfaTotpSetup() {
  return apiCall<{ otpauth_url: string; issuer: string; account_name: string; secret: string }>(
    "/api/auth/mfa/totp/start/",
    {
      method: "POST",
    },
  )
}

export function confirmMfaTotpSetup(code: string) {
  return apiCall<{ status: string; backup_codes?: string[]; mfa_enabled?: boolean; mfa_preferred_method?: string }>(
    "/api/auth/mfa/totp/confirm/",
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
  ).then((data) => {
    updateAuthUser({ mfaEnabled: true, mfaPreferredMethod: "totp" })
    return data
  })
}

export function sendMfaEmailCode(options?: { mfaToken?: string }) {
  const headers: Record<string, string> = {}
  if (options?.mfaToken) {
    headers["Authorization"] = `Bearer ${options.mfaToken}`
  }

  return apiCall<{ detail?: string }>("/api/auth/mfa/email/send/", {
    method: "POST",
    headers,
    skipAuthRedirect: !!options?.mfaToken,
  })
}

export function regenerateBackupCodes(method: MfaMethod, code: string) {
  return apiCall<{ backup_codes: string[]; mfa_enabled?: boolean; mfa_preferred_method?: string }>(
    "/api/auth/mfa/backup/regenerate/",
    {
      method: "POST",
      body: JSON.stringify({ method, code }),
    },
  ).then((data) => {
    updateAuthUser({
      mfaEnabled: data.mfa_enabled ?? true,
      mfaPreferredMethod: data.mfa_preferred_method ?? "totp",
    })
    return data
  })
}

export function disableMfa(method: MfaMethod, code: string) {
  return apiCall<{ token?: string; mfa_enabled?: boolean; mfa_preferred_method?: string }>(
    "/api/auth/mfa/disable/",
    {
      method: "POST",
      body: JSON.stringify({ method, code }),
    },
  ).then((data) => {
    if (data.token) {
      setAuthToken(data.token)
    }
    updateAuthUser({
      token: data.token,
      mfaEnabled: false,
      mfaPreferredMethod: null,
    })
    return data
  })
}

export async function verifyMfaChallenge(
  method: MfaMethod,
  code: string,
  options?: { mfaToken?: string },
) {
  const headers: Record<string, string> = {}
  if (options?.mfaToken) {
    headers["Authorization"] = `Bearer ${options.mfaToken}`
  }

  const data = await apiCall<any>("/api/auth/mfa/verify/", {
    method: "POST",
    headers,
    body: JSON.stringify({ method, code }),
    skipAuthRedirect: !!options?.mfaToken,
  })

  if (data?.token) {
    const authUser = mapSessionToAuthUser(data)
    setAuthToken(authUser.token)
    setAuthUser(authUser)
  }

  return data
}

export function startEmailChange(newEmail: string, options?: { method?: MfaMethod; code?: string }) {
  const payload: Record<string, any> = { new_email: newEmail }
  if (options?.method) payload.method = options.method
  if (options?.code) payload.code = options.code

  return apiCall<{ detail: string }>("/api/auth/email/change/start/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function verifyEmailChange(code: string) {
  const data = await apiCall<any>("/api/auth/email/change/verify/", {
    method: "POST",
    body: JSON.stringify({ code }),
  })

  if (data?.token) {
    const authUser = mapSessionToAuthUser(data)
    setAuthToken(authUser.token)
    setAuthUser(authUser)
  }

  return data
}

// =========================
// DataSource endpoints
// =========================

export function listDataSources() {
  return apiCall("/api/datasources/")
}

export function createDataSource(data: any) {
  return apiCall("/api/datasources/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateDataSource(id: number, data: any) {
  return apiCall(`/api/datasources/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteDataSource(id: number) {
  return apiCall(`/api/datasources/${id}/`, {
    method: "DELETE",
  })
}

export function testDataSourceConnection(id: number) {
  return apiCall(`/api/datasources/${id}/test-connection/`, {
    method: "POST",
  })
}

// =========================
// Bot endpoints
// =========================

export function listBots() {
  return apiCall("/api/bots/")
}

export function createBot(data: any) {
  return apiCall("/api/bots/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function getBot(id: number) {
  return apiCall(`/api/bots/${id}/`)
}

export function updateBot(id: number, data: any) {
  return apiCall(`/api/bots/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteBot(id: number) {
  return apiCall(`/api/bots/${id}/`, {
    method: "DELETE",
  })
}

// =========================
// Conversation endpoints
// =========================

export function listConversations(botId?: number) {
  if (botId) {
    return apiCall(`/api/conversations/?bot_id=${botId}`)
  }
  return apiCall("/api/conversations/")
}

export function getConversation(id: number) {
  return apiCall(`/api/conversations/${id}/`)
}

export function renameConversation(id: number, title: string) {
  return apiCall(`/api/conversations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  })
}

export function deleteConversation(id: number) {
  return apiCall(`/api/conversations/${id}/`, {
    method: "DELETE",
  })
}

// =========================
// Chat endpoint
// =========================

export function sendChatMessage(botId: number, message: string, conversationId?: number) {
  const body: any = {
    bot_id: botId,
    message,
  }
  if (conversationId) {
    body.conversation_id = conversationId
  }
  return apiCall("/api/chat/send/", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

// =========================
// Org users endpoints
// =========================

export type OrgUser = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: string
  is_org_owner: boolean
  status: string
  created_at: string
}

export function listOrgUsers() {
  return apiCall<OrgUser[]>("/api/auth/org/users/")
}

export function createOrgUser(data: {
  email: string
  username: string
  password: string
  first_name?: string
  last_name?: string
}) {
  // el backend devuelve datos básicos del usuario creado;
  // para la lista usamos listOrgUsers() después
  return apiCall("/api/auth/org/users/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateOrgUser(
  userId: number,
  data: {
    first_name?: string
    last_name?: string
    status?: string
    password?: string
  },
) {
  return apiCall<OrgUser>(`/api/auth/org/users/${userId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteOrgUser(userId: number) {
  return apiCall(`/api/auth/org/users/${userId}/`, {
    method: "DELETE",
  })
}

// =========================
// Billing endpoints
// =========================

export type PlanEntitlements = {
  max_questions_per_month?: number | null
  max_users?: number | null
  max_datasources?: number | null
  feature_flags?: Record<string, boolean>
}

export type Plan = {
  code: string
  name: string
  description?: string
  is_active: boolean
  entitlements?: PlanEntitlements | null
  plan_snapshot?: {
    entitlements?: PlanEntitlements | null
    code?: string
    name?: string
  }
}

export type PlanSnapshot = {
  code?: string
  name?: string
  description?: string
  entitlements?: PlanEntitlements | null
}

export type Subscription = {
  plan: Plan
  status: string
  started_at?: string
  ends_at?: string | null
  plan_snapshot?: PlanSnapshot
  entitlements?: PlanEntitlements | null
}

export function listPlans(includeInactive = false, options?: { skipAuthRedirect?: boolean }) {
  const query = includeInactive ? "?include_inactive=1" : ""
  return apiCall<Plan[]>(`/api/billing/plans/${query}`, {
    skipAuthRedirect: options?.skipAuthRedirect,
  })
}

export function getSubscription() {
  return apiCall<Subscription>("/api/billing/subscription/")
}

export function updateSubscription(planCode: string) {
  return apiCall<Subscription>("/api/billing/subscription/", {
    method: "PUT",
    body: JSON.stringify({ plan_code: planCode }),
  })
}

// =========================
// Account endpoints
// =========================

export function updateOwnerPassword(
  currentPassword: string,
  newPassword: string,
  options?: { method?: MfaMethod; code?: string },
) {
  const payload: Record<string, any> = {
    current_password: currentPassword,
    new_password: newPassword,
  }

  if (options?.method) {
    payload.method = options.method
  }
  if (options?.code) {
    payload.code = options.code
  }

  return apiCall<{ token: string; email: string; username: string }>("/api/auth/org/owner/password/", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => {
    setAuthToken(data.token)
    updateAuthUser({ token: data.token, email: data.email, username: data.username })
    return data
  })
}
