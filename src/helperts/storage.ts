export const STORAGE_AUTH_KEY = 'auth_key'

export const getStorageItem = name => localStorage.getItem(name)
export const setStorageItem = (name, value) => localStorage.setItem(name, value)
export const delStorageItem = name => localStorage.removeItem(name)

export const getAuthKey = () => getStorageItem(STORAGE_AUTH_KEY)
export const setAuthKey = (value) => setStorageItem(STORAGE_AUTH_KEY, value)
export const delAuthKey = () => delStorageItem(STORAGE_AUTH_KEY)