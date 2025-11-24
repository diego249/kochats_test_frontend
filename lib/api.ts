import { getAuthToken, getApiUrl } from "./auth"

type RequestInit = {
  method?: string
  headers?: Record<string, string>
  body?: string
}

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${getApiUrl()}${endpoint}`
  const token = getAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Token ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Unauthorized - clear token and redirect
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
    throw new Error("Unauthorized")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || error.message || `API error: ${response.status}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Auth endpoints
export function login(username: string, password: string) {
  return apiCall("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export function register(email: string, username: string, password: string) {
  return apiCall("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  })
}

export function logout() {
  return apiCall("/api/auth/logout/", {
    method: "POST",
  })
}

// DataSource endpoints
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

// Bot endpoints
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

// Conversation endpoints
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

// Chat endpoint
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
