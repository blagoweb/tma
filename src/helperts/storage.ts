export const STORAGE_AUTH_KEY = 'auth_key'

export const getStorageItem = (name: string) => localStorage.getItem(name)
export const setStorageItem = (name: string, value: string) => localStorage.setItem(name, value)
export const delStorageItem = (name: string) => localStorage.removeItem(name)

export const getAuthKey = () => getStorageItem(STORAGE_AUTH_KEY)
export const setAuthKey = (value: string) => setStorageItem(STORAGE_AUTH_KEY, value)
export const delAuthKey = () => delStorageItem(STORAGE_AUTH_KEY)