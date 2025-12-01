const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: {
    id: number
    username: string
    role: string
  }
}

export interface Event {
  id: number
  name: string
  description: string
  date: string
  location: string
  initial_quota: number
  current_quota: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

let authToken: string | null = null

// Get stored token from localStorage
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("auth_token")
  }
  return authToken
}

// Set token
export const setAuthToken = (token: string) => {
  authToken = token
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

// Clear token
export const clearAuthToken = () => {
  authToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

// Get auth headers
const getHeaders = (includeAuth = true) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Login failed")
    }

    const data = await res.json()
    if (data.token) {
      setAuthToken(data.token)
    }
    return data
  },

  logout: () => {
    clearAuthToken()
  },
}

// Events API
export const eventsApi = {
  // Get all events (public)
  getAll: async (): Promise<Event[]> => {
    const res = await fetch(`${API_BASE_URL}/events`, {
      headers: getHeaders(false),
    })

    if (!res.ok) {
      throw new Error("Failed to fetch events")
    }

    const data: ApiResponse<Event[]> = await res.json()
    return data.data || []
  },

  // Get event by ID
  getById: async (id: number): Promise<Event> => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: getHeaders(false),
    })

    if (!res.ok) {
      throw new Error("Failed to fetch event")
    }

    const data: ApiResponse<Event> = await res.json()
    return data.data!
  },

  // Create event (admin only)
  create: async (eventData: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> => {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        name: eventData.name,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        initial_quota: eventData.initial_quota,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to create event")
    }

    const data: ApiResponse<Event> = await res.json()
    return data.data!
  },

  // Update event (admin only)
  update: async (id: number, eventData: Partial<Omit<Event, "id" | "created_at" | "updated_at">>): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(eventData),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to update event")
    }
  },

  // Delete event (admin only)
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to delete event")
    }
  },

  // Register to event
  register: async (eventId: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to register")
    }
  },

  // Check if user is registered to event
  checkRegistration: async (eventId: number): Promise<boolean> => {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/check-registration`, {
      headers: getHeaders(true),
    })

    if (!res.ok) {
      return false
    }

    const data: ApiResponse<{ isRegistered: boolean }> = await res.json()
    return data.data?.isRegistered || false
  },
}
