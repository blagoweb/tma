<template>
    <RouterView />
</template>

<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton'

useBackButton()
</script>
