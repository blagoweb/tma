<template>
  <div class="app">
    <h1>Telegram Mini App на Vue3 🚀</h1>
    <p>{{ userInfo }}</p>
    <button @click="closeApp">Закрыть Mini App</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tg = window.Telegram.WebApp
const userInfo = ref('')

onMounted(() => {
  tg.ready()  // уведомляем Telegram, что приложение готово
  tg.expand() // разворачиваем приложение на весь экран

  // пример получения данных пользователя
  userInfo.value = JSON.stringify(tg.initDataUnsafe.user || {})
})

// Пример закрытия приложения
const closeApp = () => tg.close()
</script>

<style scoped>
.app {
  padding: env(safe-area-inset-top) 16px env(safe-area-inset-bottom);
  text-align: center;
}
</style>