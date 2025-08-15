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
  const userName = computed(() => user.value?.username || 'Гость')

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setUser = async () => {
    console.log('store: setUser called')
    setLoading(true)
    try {
      console.log('store: calling authTelegram...')
      user.value = await authTelegram()
      console.log('store: authTelegram result:', user.value)
    } catch (error) {
      console.error('store: authTelegram error:', error)
      user.value = null
    } finally {
      setLoading(false)
    }
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
