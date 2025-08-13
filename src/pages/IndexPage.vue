<template>
  <div class="index-page">
    <div class="header">
      <h1>Telegram Mini App</h1>
      <p>Демонстрация системы авторизации</p>
    </div>

    <div class="auth-section">
      <AuthButton />
    </div>

    <div v-if="isAuthenticated && user" class="user-section">
      <h2>Информация о пользователе</h2>
      <div class="user-card">
        <div class="user-avatar">
          <div class="avatar-placeholder">
            {{ user.first_name.charAt(0) }}{{ user.last_name?.charAt(0) || '' }}
          </div>
        </div>
        <div class="user-details">
          <h3>{{ user.first_name }} {{ user.last_name }}</h3>
          <p class="username">@{{ user.username }}</p>
          <div class="user-stats">
            <div class="stat">
              <span class="label">ID:</span>
              <span class="value">{{ user.id }}</span>
            </div>
            <div class="stat">
              <span class="label">Telegram ID:</span>
              <span class="value">{{ user.telegram_id }}</span>
            </div>
            <div class="stat">
              <span class="label">Дата регистрации:</span>
              <span class="value">{{ formatDate(user.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAuthenticated" class="actions-section">
      <h2>Действия</h2>
      <div class="action-buttons">
        <button @click="testApiCall" :disabled="isLoading" class="action-btn">
          {{ isLoading ? 'Загрузка...' : 'Тест API запроса' }}
        </button>
        <button @click="refreshAuth" :disabled="isLoading" class="action-btn">
          Обновить авторизацию
        </button>
        <button @click="showUserData" class="action-btn">
          Показать данные в консоли
        </button>
      </div>
    </div>

    <div v-if="error" class="error-section">
      <h3>Ошибка</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="clearError" class="error-btn">Очистить ошибку</button>
    </div>

    <div class="info-section">
      <h2>Информация о системе</h2>
      <div class="info-grid">
        <div class="info-item">
          <h4>Статус авторизации</h4>
          <p>{{ isAuthenticated ? 'Авторизован' : 'Не авторизован' }}</p>
        </div>
        <div class="info-item">
          <h4>Токен</h4>
          <p>{{ token ? 'Присутствует' : 'Отсутствует' }}</p>
        </div>
        <div class="info-item">
          <h4>Telegram Init Data</h4>
          <p>{{ hasInitData ? 'Доступна' : 'Недоступна' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initData } from '@telegram-apps/sdk-vue'
import { useAuth } from '../composables/useAuth'
import { apiGet } from '../utils/api'
import AuthButton from '../components/AuthButton.vue'

const {
  user,
  token,
  isAuthenticated,
  isLoading,
  error,
  refreshAuth,
  clearError,
} = useAuth()

const hasInitData = computed(() => !!initData.value)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const testApiCall = async () => {
  try {
    console.log('Тестируем API запрос...')
    const response = await apiGet('/api/v1/user/profile')
    console.log('API ответ:', response.data)
    alert('API запрос успешен! Проверьте консоль для деталей.')
  } catch (error) {
    console.error('API ошибка:', error)
    alert('API запрос не удался. Проверьте консоль для деталей.')
  }
}

const showUserData = () => {
  console.log('Данные пользователя:', user.value)
  console.log('Токен:', token.value)
  console.log('Telegram Init Data:', initData.value)
  alert('Данные выведены в консоль!')
}
</script>

<style scoped>
.index-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: var(--tg-theme-text-color, #000000);
  margin-bottom: 8px;
}

.header p {
  color: var(--tg-theme-hint-color, #666666);
  font-size: 16px;
}

.auth-section {
  margin-bottom: 40px;
}

.user-section {
  margin-bottom: 40px;
}

.user-section h2 {
  color: var(--tg-theme-text-color, #000000);
  margin-bottom: 20px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--tg-theme-bg-color, #ffffff);
  border: 1px solid var(--tg-theme-hint-color, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  background: var(--tg-theme-button-color, #0088cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.user-details h3 {
  margin: 0 0 4px 0;
  color: var(--tg-theme-text-color, #000000);
  font-size: 18px;
}

.username {
  color: var(--tg-theme-hint-color, #666666);
  margin: 0 0 16px 0;
  font-size: 14px;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.stat .label {
  color: var(--tg-theme-hint-color, #666666);
  font-weight: 500;
}

.stat .value {
  color: var(--tg-theme-text-color, #000000);
  font-weight: 600;
}

.actions-section {
  margin-bottom: 40px;
}

.actions-section h2 {
  color: var(--tg-theme-text-color, #000000);
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 12px 24px;
  background: var(--tg-theme-button-color, #0088cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-section {
  margin-bottom: 40px;
  padding: 16px;
  background: var(--tg-theme-destructive-text-color, #ff4444);
  color: #ffffff;
  border-radius: 8px;
}

.error-section h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.error-message {
  margin: 0 0 12px 0;
  font-size: 14px;
}

.error-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.info-section {
  margin-bottom: 40px;
}

.info-section h2 {
  color: var(--tg-theme-text-color, #000000);
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 16px;
  background: var(--tg-theme-bg-color, #ffffff);
  border: 1px solid var(--tg-theme-hint-color, #e0e0e0);
  border-radius: 8px;
}

.info-item h4 {
  margin: 0 0 8px 0;
  color: var(--tg-theme-text-color, #000000);
  font-size: 14px;
  font-weight: 600;
}

.info-item p {
  margin: 0;
  color: var(--tg-theme-hint-color, #666666);
  font-size: 14px;
}

@media (max-width: 600px) {
  .index-page {
    padding: 16px;
  }
  
  .user-card {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons {
    gap: 8px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>