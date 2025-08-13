export interface TelegramUser {
  id: number
  telegram_id: number
  username: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: TelegramUser
}

export interface AuthState {
  user: TelegramUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  initData: string
}
