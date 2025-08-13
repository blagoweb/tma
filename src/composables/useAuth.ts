import { ref, computed, readonly } from 'vue'
import { initData } from '@telegram-apps/sdk-vue'
import { AuthService } from '../services/auth'
import type { AuthState, TelegramUser, AuthResponse } from '../types/auth'

/**
 * Composable for managing authentication state and operations
 */
export function useAuth() {
  // Reactive state
  const state = ref<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })

  // Computed properties
  const user = computed(() => state.value.user)
  const token = computed(() => state.value.token)
  const isAuthenticated = computed(() => state.value.isAuthenticated)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)

  /**
   * Initialize authentication state from cookies
   */
  function initializeAuth(): void {
    try {
      const savedToken = AuthService.getCurrentToken()
      const savedUser = AuthService.getCurrentUser()

      if (savedToken && savedUser) {
        state.value = {
          user: savedUser,
          token: savedToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      state.value.error = 'Failed to initialize authentication'
    }
  }

  /**
   * Login with Telegram init data
   */
  async function login(): Promise<boolean> {
    try {
      state.value.isLoading = true
      state.value.error = null

      // Get init data from Telegram SDK
      const telegramInitData = initData.value
      
      if (!telegramInitData) {
        throw new Error('Telegram init data not available')
      }

      // Validate init data
      if (!AuthService.validateInitData(telegramInitData)) {
        throw new Error('Invalid Telegram init data')
      }

      // Authenticate with backend
      const authResponse: AuthResponse = await AuthService.login({
        initData: telegramInitData,
      })

      // Update state
      state.value = {
        user: authResponse.user,
        token: authResponse.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

      return true
    } catch (error) {
      console.error('Login failed:', error)
      state.value = {
        ...state.value,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }
      return false
    }
  }

  /**
   * Logout user
   */
  function logout(): void {
    try {
      AuthService.logout()
      
      // Reset state
      state.value = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    } catch (error) {
      console.error('Logout failed:', error)
      state.value.error = 'Logout failed'
    }
  }

  /**
   * Refresh authentication
   */
  async function refreshAuth(): Promise<boolean> {
    try {
      state.value.isLoading = true
      state.value.error = null

      const success = await AuthService.refreshAuth()
      
      if (success) {
        // Re-initialize auth state
        initializeAuth()
      } else {
        // Auth is invalid, logout
        logout()
      }

      state.value.isLoading = false
      return success
    } catch (error) {
      console.error('Auth refresh failed:', error)
      state.value = {
        ...state.value,
        isLoading: false,
        error: 'Authentication refresh failed',
      }
      return false
    }
  }

  /**
   * Update user data
   */
  function updateUser(userData: Partial<TelegramUser>): void {
    if (state.value.user) {
      state.value.user = { ...state.value.user, ...userData }
      
      // Update user data in cookies
      try {
        const userDataString = JSON.stringify(state.value.user)
        const { setUserData } = await import('../utils/cookies')
        setUserData(userDataString)
      } catch (error) {
        console.error('Failed to update user data in cookies:', error)
      }
    }
  }

  /**
   * Clear error state
   */
  function clearError(): void {
    state.value.error = null
  }

  /**
   * Check if user has specific property
   */
  function hasUserProperty(property: keyof TelegramUser): boolean {
    return state.value.user ? property in state.value.user : false
  }

  /**
   * Get user property value
   */
  function getUserProperty<K extends keyof TelegramUser>(property: K): TelegramUser[K] | null {
    return state.value.user ? state.value.user[property] : null
  }

  return {
    // State (readonly)
    state: readonly(state),
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    initializeAuth,
    login,
    logout,
    refreshAuth,
    updateUser,
    clearError,
    hasUserProperty,
    getUserProperty,
  }
}
