import type { App } from 'vue'
import { useAuth } from '../composables/useAuth'
import { AuthService } from '../services/auth'

export interface AuthPluginOptions {
  autoInitialize?: boolean
  autoLogin?: boolean
  onAuthChange?: (isAuthenticated: boolean) => void
  onError?: (error: string) => void
}

/**
 * Authentication plugin for Vue app
 */
export const authPlugin = {
  install(app: App, options: AuthPluginOptions = {}) {
    const {
      autoInitialize = true,
      autoLogin = true,
      onAuthChange,
      onError,
    } = options

    // Create global auth composable
    const auth = useAuth()

    // Provide auth to all components
    app.provide('auth', auth)

    // Add auth to global properties
    app.config.globalProperties.$auth = auth

    // Auto-initialize auth if enabled
    if (autoInitialize) {
      auth.initializeAuth()
    }

    // Auto-login if enabled and not authenticated
    if (autoLogin && !auth.isAuthenticated.value) {
      auth.login().catch((error) => {
        console.error('Auto-login failed:', error)
        if (onError) {
          onError(error.message || 'Auto-login failed')
        }
      })
    }

    // Watch for auth changes
    if (onAuthChange) {
      // Note: In a real implementation, you might want to use a more sophisticated
      // watcher or event system to detect auth changes
      // For now, we'll rely on the composable's reactive state
    }

    // Add auth methods to global properties
    app.config.globalProperties.$login = auth.login
    app.config.globalProperties.$logout = auth.logout
    app.config.globalProperties.$isAuthenticated = auth.isAuthenticated
    app.config.globalProperties.$getUser = auth.user
  },
}

/**
 * Create auth plugin with custom options
 */
export function createAuthPlugin(options: AuthPluginOptions = {}) {
  return {
    install(app: App) {
      authPlugin.install(app, options)
    },
  }
}

/**
 * Default auth plugin instance
 */
export default authPlugin
