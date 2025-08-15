<template>
  <AppPage title="Ваши страницы" :back="false">
    <pre>{{pages}}</pre>
  </AppPage>
</template>

<script setup lang="ts">
import {getPages} from "@/api/pages";

const pages = ref([])
onBeforeMount(async () => {
  pages.value = await getPages()
})
</script>