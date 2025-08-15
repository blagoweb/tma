<template>
  <AppPage :title="title" :back="false">
    <p>
      Создай мини-лендинг для соцсетей с аналитикой, заявками и платежами в Telegram — быстро, удобно, без кода.
    </p>
  </AppPage>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const title = computed(() => `Привет, ${appStore.userName}`)
</script>