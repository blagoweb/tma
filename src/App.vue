<template>
  <AppPreloader v-if="appStore.isLoading" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton'
useBackButton()

import { useAppStore } from '@/stores/app'
const appStore = useAppStore()

onBeforeMount(() => {
  appStore.setUser()
})
</script>
