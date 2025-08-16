<template>
  <AppPage title="Ваши страницы" :back="false">
    <template v-slot:action>
      <IconPlusRound @click="addPage('Новый')"/>
    </template>
    <div v-for="page in pages" :key="page.id">
      <div class="flex-sb-c">
        <b>{{page.title}}</b>
        <IconEditPencil/>
      </div>
      <hr>
    </div>
  </AppPage>
</template>

<script setup lang="ts">
import {addPage, getPages} from "@/api/pages";
import type {Page} from "@/types/pages";

const pages = ref<Page[]>([])
onBeforeMount(async () => {
  pages.value = await getPages()

  if (pages.value.length === 0) {
    const page = await addPage('Основной')

    if (page) {
      pages.value.push(page)
    }
  }
})
</script>