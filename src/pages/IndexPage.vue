<template>
  <AppPage :title="title" :back="false">
    <p>
      Создай мини-лендинг для соцсетей с аналитикой, заявками и платежами в Telegram — быстро, удобно, без кода.
    </p>
    <pre>{{user}}</pre>
  </AppPage>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { user, userName } = appStore
const title = `Привет, ${userName}`
</script>