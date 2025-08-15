<template>
  <AppPreloader v-if="isLoading" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton'
useBackButton()

import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { isLoading, setUser } = appStore

onBeforeMount(() => {
  setUser()
})
</script>
