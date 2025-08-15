import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {authTelegram} from "@/api/auth";
import type {TelegramUser} from "@/types/user";

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const user = ref<TelegramUser | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value?.id)
  const userName = computed(() => `${user.value?.first_name || ''} ${user.value?.last_name || ''}` || 'Гость')

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setUser = async () => {
      setLoading(true)
      user.value = await authTelegram()
      setLoading(false)
  }

  const clearUser = () => {
    user.value = null
  }

  return {
    // State
    isLoading,
    user,

    // Getters
    isAuthenticated,
    userName,
    
    // Actions
    setLoading,
    setUser,
    clearUser
  }
})
