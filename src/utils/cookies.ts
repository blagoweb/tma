/**
 * Cookie utilities for managing authentication tokens
 */

const TOKEN_COOKIE_NAME = 'auth_token'
const USER_COOKIE_NAME = 'user_data'

export interface CookieOptions {
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const {
    expires,
    path = '/',
    domain,
    secure = true,
    sameSite = 'Strict'
  } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += '; secure'
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }

  return null
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, options: CookieOptions = {}): void {
  const { path = '/', domain } = options
  
  setCookie(name, '', {
    ...options,
    path,
    domain,
    expires: new Date(0)
  })
}

/**
 * Set authentication token cookie
 */
export function setAuthToken(token: string, options: CookieOptions = {}): void {
  const expires = new Date()
  expires.setDate(expires.getDate() + 30) // 30 days

  setCookie(TOKEN_COOKIE_NAME, token, {
    ...options,
    expires,
    secure: true,
    sameSite: 'Strict'
  })
}

/**
 * Get authentication token from cookie
 */
export function getAuthToken(): string | null {
  return getCookie(TOKEN_COOKIE_NAME)
}

/**
 * Delete authentication token cookie
 */
export function deleteAuthToken(options: CookieOptions = {}): void {
  deleteCookie(TOKEN_COOKIE_NAME, options)
}

/**
 * Set user data cookie
 */
export function setUserData(userData: string, options: CookieOptions = {}): void {
  const expires = new Date()
  expires.setDate(expires.getDate() + 30) // 30 days

  setCookie(USER_COOKIE_NAME, userData, {
    ...options,
    expires,
    secure: true,
    sameSite: 'Strict'
  })
}

/**
 * Get user data from cookie
 */
export function getUserData(): string | null {
  return getCookie(USER_COOKIE_NAME)
}

/**
 * Delete user data cookie
 */
export function deleteUserData(options: CookieOptions = {}): void {
  deleteCookie(USER_COOKIE_NAME, options)
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(options: CookieOptions = {}): void {
  deleteAuthToken(options)
  deleteUserData(options)
}
