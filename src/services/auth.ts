import { apiPost } from '../utils/api'
import { setAuthToken, setUserData, clearAuthCookies, getAuthToken, getUserData } from '../utils/cookies'
import { API_CONFIG } from '../config/api'
import type { AuthResponse, TelegramUser, LoginCredentials } from '../types/auth'

/**
 * Authentication service for Telegram Mini App
 */
export class AuthService {
  /**
   * Authenticate user with Telegram init data
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiPost<AuthResponse>(
        API_CONFIG.AUTH_ENDPOINT,
        credentials,
        false // Don't include auth header for login
      )

      const { token, user } = response.data

      // Save token and user data to cookies
      this.saveAuthData(token, user)

      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * Logout user and clear auth data
   */
  static logout(): void {
    try {
      clearAuthCookies()
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = getAuthToken()
    return !!token
  }

  /**
   * Get current user data from cookies
   */
  static getCurrentUser(): TelegramUser | null {
    try {
      const userData = getUserData()
      if (!userData) {
        return null
      }

      return JSON.parse(userData) as TelegramUser
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  }

  /**
   * Get current auth token
   */
  static getCurrentToken(): string | null {
    return getAuthToken()
  }

  /**
   * Refresh authentication data (if needed)
   */
  static async refreshAuth(): Promise<boolean> {
    try {
      const token = getAuthToken()
      const user = this.getCurrentUser()

      if (!token || !user) {
        return false
      }

      // Here you could implement token refresh logic if needed
      // For now, we just validate that we have valid data
      return true
    } catch (error) {
      console.error('Auth refresh failed:', error)
      return false
    }
  }

  /**
   * Save authentication data to cookies
   */
  private static saveAuthData(token: string, user: TelegramUser): void {
    setAuthToken(token)
    setUserData(JSON.stringify(user))
  }

  /**
   * Validate Telegram init data
   */
  static validateInitData(initData: string): boolean {
    if (!initData) {
      return false
    }

    // Basic validation - you might want to add more sophisticated validation
    // depending on your security requirements
    try {
      const params = new URLSearchParams(initData)
      return params.has('user') && params.has('auth_date')
    } catch (error) {
      console.error('Init data validation failed:', error)
      return false
    }
  }
}
