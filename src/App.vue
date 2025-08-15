<template>
  <AppPreloader v-if="isLoading" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton'
import { initData } from '@telegram-apps/sdk-vue'

import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { isLoading, setUser } = appStore

useBackButton()
console.log('App.vue: init')

onMounted(() => {
  console.log('App.vue: onMounted called')
  console.log('App.vue: initData ready:', !!initData)
  console.log('App.vue: initData.raw():', initData?.raw())
  
  // Ждем готовности initData
  const waitForReady = () => {
    if (initData?.raw()) {
      console.log('App.vue: initData ready, calling setUser...')
      setUser().then(() => {
        console.log('App.vue: setUser completed')
      }).catch((error) => {
        console.error('App.vue: setUser failed:', error)
      })
    } else {
      console.log('App.vue: initData not ready yet, waiting...')
      setTimeout(waitForReady, 100)
    }
  }
  
  waitForReady()
})
</script>
