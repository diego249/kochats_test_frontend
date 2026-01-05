export type AuthUser = {
  token: string
  username: string
  email: string
  userType: string
  organizationId: number | null
  organizationName: string | null
  isOrgOwner: boolean
  plan: string | null
  emailVerified: boolean
  verificationRequired?: boolean
  emailVerifiedAt?: string | null
  mfaEnabled?: boolean
  mfaPreferredMethod?: "totp" | "email" | null
  mfaCompletedAt?: string | null
  pendingEmail?: string | null
}

function normalizeAuthUser(user: any): AuthUser {
  const emailVerified = !!(user?.emailVerified ?? user?.email_verified)
  return {
    token: user?.token,
    username: user?.username,
    email: user?.email,
    userType: user?.userType ?? user?.user_type,
    organizationId: user?.organizationId ?? user?.organization_id ?? null,
    organizationName: user?.organizationName ?? user?.organization_name ?? null,
    isOrgOwner: !!(user?.isOrgOwner ?? user?.is_org_owner),
    plan: user?.plan ?? user?.plan_code ?? null,
    emailVerified,
    verificationRequired:
      user?.verificationRequired ?? user?.verification_required ?? (emailVerified ? false : undefined),
    emailVerifiedAt: user?.emailVerifiedAt ?? user?.email_verified_at ?? null,
    mfaEnabled: user?.mfaEnabled ?? user?.mfa_enabled ?? false,
    mfaPreferredMethod:
      user?.mfaPreferredMethod ?? user?.mfa_preferred_method ?? user?.preferred_method ?? null,
    mfaCompletedAt: user?.mfaCompletedAt ?? user?.mfa_completed_at ?? null,
    pendingEmail: user?.pendingEmail ?? user?.pending_email ?? null,
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("authUser")
  return data ? normalizeAuthUser(JSON.parse(data)) : null
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    const normalized = normalizeAuthUser(user)
    localStorage.setItem("authUser", JSON.stringify(normalized))
  }
}

export function clearAuthUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authUser")
    localStorage.removeItem("pendingVerificationPath")
  }
}

export function updateAuthUser(user: Partial<AuthUser>): void {
  const current = getAuthUser()
  if (!current) return
  setAuthUser({ ...current, ...user })
}

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
}
