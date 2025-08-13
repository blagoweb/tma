<template>
  <div class="auth-button">
    <button
      v-if="!isAuthenticated"
      @click="handleLogin"
      :disabled="isLoading"
      class="login-btn"
    >
      <span v-if="isLoading">Авторизация...</span>
      <span v-else>Войти через Telegram</span>
    </button>

    <div v-else class="user-info">
      <div class="user-details">
        <span class="username">{{ user?.username || 'Пользователь' }}</span>
        <span class="name">{{ user?.first_name }} {{ user?.last_name }}</span>
      </div>
      <button @click="handleLogout" class="logout-btn">
        Выйти
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const {
  user,
  isAuthenticated,
  isLoading,
  error,
  login,
  logout,
  clearError,
} = useAuth()

const handleLogin = async () => {
  clearError()
  const success = await login()
  
  if (success) {
    console.log('Успешная авторизация:', user.value)
  } else {
    console.error('Ошибка авторизации:', error.value)
  }
}

const handleLogout = () => {
  logout()
  console.log('Пользователь вышел из системы')
}
</script>

<style scoped>
.auth-button {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: var(--tg-theme-bg-color, #ffffff);
  border: 1px solid var(--tg-theme-hint-color, #e0e0e0);
}

.login-btn,
.logout-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn {
  background: var(--tg-theme-button-color, #0088cc);
  color: var(--tg-theme-button-text-color, #ffffff);
}

.login-btn:hover:not(:disabled) {
  background: var(--tg-theme-button-color, #0088cc);
  opacity: 0.9;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-btn {
  background: var(--tg-theme-destructive-text-color, #ff4444);
  color: #ffffff;
}

.logout-btn:hover {
  background: var(--tg-theme-destructive-text-color, #ff4444);
  opacity: 0.9;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.name {
  font-size: 12px;
  color: var(--tg-theme-hint-color, #666666);
}

.error-message {
  padding: 8px 12px;
  background: var(--tg-theme-destructive-text-color, #ff4444);
  color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}
</style>
