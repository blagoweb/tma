# Telegram Mini App Authentication System

Best-practices система авторизации для Telegram Mini App с использованием JWT токенов и кук.

## Архитектура

```
src/
├── types/auth.ts          # Типы для авторизации
├── config/api.ts          # Конфигурация API
├── utils/
│   ├── cookies.ts         # Утилиты для работы с куками
│   └── api.ts            # Утилиты для API запросов
├── services/
│   └── auth.ts           # Сервис авторизации
├── composables/
│   └── useAuth.ts        # Vue composable для авторизации
├── middleware/
│   └── auth.ts           # Middleware для роутера
├── plugins/
│   └── auth.ts           # Vue плагин авторизации
└── components/
    └── AuthButton.vue    # Компонент кнопки авторизации
```

## Основные возможности

- ✅ Автоматическая авторизация через Telegram init data
- ✅ Сохранение JWT токена в защищенных куках
- ✅ Сохранение данных пользователя (id, telegram_id, username, first_name, last_name)
- ✅ Bearer авторизация для API запросов
- ✅ Middleware для защиты маршрутов
- ✅ Автоматическое обновление токенов
- ✅ Обработка ошибок и retry логика
- ✅ TypeScript поддержка

## Быстрый старт

### 1. Установка плагина

```typescript
// main.ts
import { authPlugin } from './plugins/auth'

app.use(authPlugin, {
  autoInitialize: true,
  autoLogin: true,
  onError: (error) => {
    console.error('Auth error:', error)
  }
})
```

### 2. Использование в компонентах

```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      Привет, {{ user?.first_name }}!
      <button @click="logout">Выйти</button>
    </div>
    <button v-else @click="login" :disabled="isLoading">
      {{ isLoading ? 'Авторизация...' : 'Войти' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, isLoading, login, logout } = useAuth()
</script>
```

### 3. Защита маршрутов

```typescript
// router/index.ts
import { authGuards } from '@/middleware/auth'

const routes = [
  {
    path: '/profile',
    component: ProfilePage,
    beforeEnter: authGuards.requireAuth // Требует авторизации
  },
  {
    path: '/login',
    component: LoginPage,
    beforeEnter: authGuards.requireNoAuth // Только для неавторизованных
  },
  {
    path: '/public',
    component: PublicPage,
    beforeEnter: authGuards.optionalAuth // Доступно всем
  }
]
```

## API

### AuthService

```typescript
import { AuthService } from '@/services/auth'

// Авторизация
const authResponse = await AuthService.login({ initData: telegramInitData })

// Проверка авторизации
const isAuth = AuthService.isAuthenticated()

// Получение текущего пользователя
const user = AuthService.getCurrentUser()

// Выход
AuthService.logout()
```

### useAuth Composable

```typescript
import { useAuth } from '@/composables/useAuth'

const {
  // Состояние
  user,              // TelegramUser | null
  token,             // string | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  error,             // string | null
  
  // Методы
  initializeAuth,    // () => void
  login,             // () => Promise<boolean>
  logout,            // () => void
  refreshAuth,       // () => Promise<boolean>
  updateUser,        // (userData: Partial<TelegramUser>) => void
  clearError,        // () => void
  hasUserProperty,   // (property: keyof TelegramUser) => boolean
  getUserProperty,   // <K extends keyof TelegramUser>(property: K) => TelegramUser[K] | null
} = useAuth()
```

### Auth Guards

```typescript
import { authGuards } from '@/middleware/auth'

// Требует авторизации
authGuards.requireAuth

// Только для неавторизованных
authGuards.requireNoAuth

// Доступно всем
authGuards.optionalAuth

// Асинхронная проверка с обновлением
authGuards.asyncAuth
```

## Конфигурация

### API Configuration

```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  AUTH_ENDPOINT: '/api/v1/auth/telegram',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
```

### Environment Variables

```bash
# .env
VITE_API_BASE_URL=https://your-api.com
```

## Безопасность

### Куки

- Токен сохраняется в защищенных куках с флагом `secure`
- Используется `SameSite=Strict` для защиты от CSRF
- Автоматическое истечение через 30 дней

### API Запросы

- Автоматическое добавление Bearer токена в заголовки
- Retry логика с экспоненциальной задержкой
- Таймауты для предотвращения зависших запросов
- Валидация ответов сервера

### Валидация

- Проверка Telegram init data
- Валидация структуры ответа API
- Обработка ошибок сети и сервера

## Примеры использования

### Компонент профиля пользователя

```vue
<template>
  <div class="profile">
    <div v-if="isAuthenticated && user">
      <h2>Профиль</h2>
      <div class="user-info">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Telegram ID:</strong> {{ user.telegram_id }}</p>
        <p><strong>Username:</strong> @{{ user.username }}</p>
        <p><strong>Имя:</strong> {{ user.first_name }} {{ user.last_name }}</p>
        <p><strong>Дата регистрации:</strong> {{ formatDate(user.created_at) }}</p>
      </div>
      <button @click="logout">Выйти</button>
    </div>
    <div v-else>
      <p>Необходима авторизация</p>
      <button @click="login">Войти</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, login, logout } = useAuth()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}
</script>
```

### Защищенный API запрос

```typescript
import { apiGet } from '@/utils/api'

// Токен автоматически добавляется в заголовки
const response = await apiGet('/api/v1/user/profile')
const userData = response.data
```

### Кастомный guard

```typescript
import { AuthMiddleware } from '@/middleware/auth'

const customGuard = AuthMiddleware.createGuard({
  requireAuth: true,
  redirectTo: '/custom-login'
})
```

## Обработка ошибок

```typescript
import { useAuth } from '@/composables/useAuth'

const { error, clearError } = useAuth()

// Очистка ошибки
clearError()

// Отображение ошибки пользователю
if (error.value) {
  showNotification(error.value, 'error')
}
```

## Тестирование

```typescript
// Тест авторизации
import { AuthService } from '@/services/auth'

// Mock Telegram init data
const mockInitData = 'user=%7B%22id%22%3A123%7D&auth_date=1234567890'

const authResponse = await AuthService.login({ initData: mockInitData })
expect(authResponse.user.telegram_id).toBe(123)
```

## Лучшие практики

1. **Всегда используйте типизацию** - все интерфейсы и типы определены
2. **Обрабатывайте ошибки** - используйте try-catch и проверяйте состояние
3. **Используйте guards** - защищайте маршруты с помощью middleware
4. **Кэшируйте данные** - пользовательские данные сохраняются в куках
5. **Обновляйте токены** - используйте asyncAuth для автоматического обновления
6. **Логируйте ошибки** - для отладки и мониторинга

## Troubleshooting

### Проблема: Токен не сохраняется
- Проверьте настройки кук (domain, path, secure)
- Убедитесь, что используется HTTPS в продакшене

### Проблема: API запросы не авторизованы
- Проверьте, что токен корректно добавляется в заголовки
- Убедитесь, что сервер принимает Bearer токены

### Проблема: Авторизация не работает в Telegram
- Проверьте, что initData корректно передается
- Убедитесь, что бот настроен правильно

### Проблема: Ошибки сети
- Проверьте настройки API_CONFIG
- Убедитесь, что сервер доступен
- Проверьте CORS настройки
