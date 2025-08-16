<template>
    <div class="rel mt-24 ms-4">
        <h1 class="flex-sb-c pb-6">
          {{ title }}
          <slot name="action"/>
        </h1>
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>