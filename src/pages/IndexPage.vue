<template>
  <AppPage title="Привет" :back="false">
    <p>
      Создай мини-лендинг для соцсетей с аналитикой, заявками и платежами в Telegram — быстро, удобно, без кода.
    </p>
    <div v-for="endpoint in endpoints" :key="endpoint.name" class="border rounded p-4">
      <h2 class="text-xl font-medium">{{ endpoint.name }}</h2>
      <div class="mt-2 space-x-2">
        <button
            @click="callEndpoint(endpoint)"
            class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Call
        </button>
        <pre v-if="pre">{{ JSON.stringify(pre, null, 2) }}</pre>
      </div>
      <div v-if="results[endpoint.name]" class="mt-2 bg-gray-100 p-2 rounded text-sm font-mono overflow-auto">
        <pre>{{ results[endpoint.name] }}</pre>
      </div>
    </div>
  </AppPage>
</template>

<script setup lang="ts">
import {initData} from "@telegram-apps/sdk-vue";

const endpoints = [
  { name: 'Auth/Login', method: 'POST', path: '/api/v1/auth/telegram', body: { init_data: initData.raw() } },
  { name: 'Check JWT', method: 'GET', path: '/api/v1/items' },
]

interface Endpoint {
  name: string;
  method: string;
  path: string;
  body?: any;
}

const results = reactive<Record<string, string>>({})

const pre = ref<any>(null)

async function callEndpoint(endpoint: Endpoint) {
  results[endpoint.name] = 'Loading...'
  const url = import.meta.env.VITE_API_BASE + endpoint.path
  pre.value = endpoint?.body
  try {
    const res = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...(endpoint.name !== 'Auth/Login' ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
      },
      body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
    })
    results[endpoint.name] = await res.text()
  } catch (err) {
    results[endpoint.name] = err instanceof Error ? err.message : String(err)
  }
}
</script>