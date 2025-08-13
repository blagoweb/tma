import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../config/api'
import { getAuthToken } from './cookies'

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

export interface ApiError {
  message: string
  status: number
  statusText: string
}

/**
 * Create headers for API requests
 */
function createHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Create a timeout promise
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(ERROR_MESSAGES.TIMEOUT_ERROR))
    }, timeout)
  })
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  attempts: number,
  delay: number
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (attempts <= 1) {
      throw error
    }

    await new Promise(resolve => setTimeout(resolve, delay))
    return retryWithBackoff(fn, attempts - 1, delay * 2)
  }
}

/**
 * Make an API request with error handling and retry logic
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = true
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...createHeaders(includeAuth),
      ...options.headers,
    },
  }

  const makeRequest = async (): Promise<ApiResponse<T>> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error: ApiError = {
          message: getErrorMessage(response.status),
          status: response.status,
          statusText: response.statusText,
        }
        throw error
      }

      const data = await response.json()

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR)
        }
        throw error
      }
      
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  return retryWithBackoff(
    makeRequest,
    API_CONFIG.RETRY_ATTEMPTS,
    API_CONFIG.RETRY_DELAY
  )
}

/**
 * Get error message based on HTTP status
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Bad request'
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.INTERNAL_ERROR
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR
  }
}

/**
 * GET request helper
 */
export function apiGet<T = any>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' }, includeAuth)
}

/**
 * POST request helper
 */
export function apiPost<T = any>(
  endpoint: string,
  data?: any,
  includeAuth = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }, includeAuth)
}

/**
 * PUT request helper
 */
export function apiPut<T = any>(
  endpoint: string,
  data?: any,
  includeAuth = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }, includeAuth)
}

/**
 * DELETE request helper
 */
export function apiDelete<T = any>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' }, includeAuth)
}
