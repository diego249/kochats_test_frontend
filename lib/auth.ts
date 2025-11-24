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

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
}
