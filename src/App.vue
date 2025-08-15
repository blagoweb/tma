<template>
  <AppPreloader v-if="isLoading" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton'

import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { isLoading, setUser } = appStore

useBackButton()
console.log('init')

onMounted(() => {
  console.log(0)
  setUser()
})
</script>
