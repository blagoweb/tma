import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { AuthService } from '../services/auth'

export interface AuthGuardOptions {
  requireAuth?: boolean
  redirectTo?: string
  allowUnauthenticated?: boolean
}

/**
 * Authentication middleware for route guards
 */
export class AuthMiddleware {
  /**
   * Require authentication - redirect to login if not authenticated
   */
  static requireAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    options: AuthGuardOptions = {}
  ): void {
    const { redirectTo = '/login' } = options

    if (AuthService.isAuthenticated()) {
      next()
    } else {
      next({ path: redirectTo, query: { redirect: to.fullPath } })
    }
  }

  /**
   * Require no authentication - redirect to home if already authenticated
   */
  static requireNoAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    options: AuthGuardOptions = {}
  ): void {
    const { redirectTo = '/' } = options

    if (!AuthService.isAuthenticated()) {
      next()
    } else {
      next({ path: redirectTo })
    }
  }

  /**
   * Optional authentication - allow both authenticated and unauthenticated users
   */
  static optionalAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    next()
  }

  /**
   * Check authentication and refresh if needed
   */
  static async checkAndRefreshAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    options: AuthGuardOptions = {}
  ): Promise<void> {
    const { requireAuth = true, redirectTo = '/login' } = options

    try {
      // Check if user is authenticated
      if (AuthService.isAuthenticated()) {
        // Try to refresh auth if needed
        const isValid = await AuthService.refreshAuth()
        
        if (isValid) {
          next()
        } else {
          // Auth is invalid, redirect to login
          next({ path: redirectTo, query: { redirect: to.fullPath } })
        }
      } else if (requireAuth) {
        // Not authenticated and auth is required
        next({ path: redirectTo, query: { redirect: to.fullPath } })
      } else {
        // Not authenticated but auth is not required
        next()
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      
      if (requireAuth) {
        next({ path: redirectTo, query: { redirect: to.fullPath } })
      } else {
        next()
      }
    }
  }

  /**
   * Create a route guard function
   */
  static createGuard(options: AuthGuardOptions = {}) {
    return (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const { requireAuth = true, allowUnauthenticated = false } = options

      if (requireAuth && !allowUnauthenticated) {
        this.requireAuth(to, from, next, options)
      } else if (!requireAuth) {
        this.requireNoAuth(to, from, next, options)
      } else {
        this.optionalAuth(to, from, next)
      }
    }
  }

  /**
   * Create an async route guard function with refresh capability
   */
  static createAsyncGuard(options: AuthGuardOptions = {}) {
    return async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      await this.checkAndRefreshAuth(to, from, next, options)
    }
  }
}

/**
 * Predefined guard functions for common use cases
 */
export const authGuards = {
  /**
   * Require authentication for protected routes
   */
  requireAuth: AuthMiddleware.createGuard({ requireAuth: true }),

  /**
   * Require no authentication for public routes (like login)
   */
  requireNoAuth: AuthMiddleware.createGuard({ requireAuth: false }),

  /**
   * Allow both authenticated and unauthenticated users
   */
  optionalAuth: AuthMiddleware.createGuard({ requireAuth: true, allowUnauthenticated: true }),

  /**
   * Async guard with auth refresh
   */
  asyncAuth: AuthMiddleware.createAsyncGuard({ requireAuth: true }),
}
