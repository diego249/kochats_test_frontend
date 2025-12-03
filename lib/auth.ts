export type AuthUser = {
  token: string
  username: string
  email: string
  userType: string
  organizationId: number | null
  organizationName: string | null
  isOrgOwner: boolean
  plan: string | null
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
  return data ? JSON.parse(data) : null
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authUser", JSON.stringify(user))
  }
}

export function clearAuthUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authUser")
  }
}

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
}
