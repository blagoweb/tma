import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const user = ref<{
    id?: string
    name?: string
    wallet?: string
  } | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value?.id)
  const userName = computed(() => user.value?.name || 'Guest')

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setUser = (userData: typeof user.value) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  return {
    // State
    isLoading,
    user,
    theme,
    
    // Getters
    isAuthenticated,
    userName,
    
    // Actions
    setLoading,
    setUser,
    clearUser
  }
})
