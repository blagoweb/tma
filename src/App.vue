<template>
  <AppPreloader v-if="isLoading" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useBackButton } from '@/composables/useBackButton'

import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { isLoading, setUser } = appStore

useBackButton()

onBeforeMount(() => {
    setUser()
})
</script>
