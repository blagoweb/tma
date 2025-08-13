<template>
  <AppPage title="Debug Page" :back="true">
    <div class="debug-page">
      <h2>Debug Information</h2>
      <div class="debug-section">
        <h3>Browser Information</h3>
        <p><strong>User Agent:</strong> {{ debugInfo.userAgent }}</p>
        <p><strong>URL:</strong> {{ debugInfo.url }}</p>
        <p><strong>Timestamp:</strong> {{ debugInfo.timestamp }}</p>
      </div>

      <div class="debug-section">
        <h3>Viewport</h3>
        <p><strong>Width:</strong> {{ debugInfo.viewport.width }}px</p>
        <p><strong>Height:</strong> {{ debugInfo.viewport.height }}px</p>
      </div>

      <div class="debug-section">
        <h3>Environment</h3>
        <p><strong>Mode:</strong> {{ envInfo.mode }}</p>
        <p><strong>Base URL:</strong> {{ envInfo.baseUrl }}</p>
      </div>

      <div class="debug-section">
        <div class="p-4 space-y-4">
          <h1 class="text-2xl font-bold">Debug API Console</h1>
          <div v-for="endpoint in endpoints" :key="endpoint.name" class="border rounded p-4">
            <h2 class="text-xl font-medium">{{ endpoint.name }}</h2>
            <div class="mt-2 space-x-2">
              <button
                  @click="callEndpoint(endpoint)"
                  class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Call
              </button>
            </div>
            <div v-if="results[endpoint.name]" class="mt-2 bg-gray-100 p-2 rounded text-sm font-mono overflow-auto">
              <pre>{{ results[endpoint.name] }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import AppPage from '@/components/AppPage.vue';

const debugInfo = ref({
  userAgent: '',
  timestamp: '',
  url: '',
  viewport: {
    width: 0,
    height: 0
  }
});

const envInfo = ref({
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.VITE_API_BASE
});

onMounted(() => {
  debugInfo.value = {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
});

import {initData} from "@telegram-apps/sdk-vue";

const endpoints = [
  { name: 'Health Check', method: 'GET', path: '/health' },
  { name: 'Auth/Login', method: 'POST', path: '/api/v1/auth/telegram', body: { initData } },
  { name: 'Check JWT', method: 'GET', path: '/api/v1/items' },
  // { name: 'List Landings', method: 'GET', path: '/api/landings' },
  // { name: 'Create Landing', method: 'POST', path: '/api/landings', body: { title: 'Test', description: 'Debug', avatarUrl: '' } },
  // { name: 'List Links', method: 'GET', path: '/api/links?landingId=1' },
  // { name: 'List Leads', method: 'GET', path: '/api/leads' },
  // { name: 'List Analytics', method: 'GET', path: '/api/analytics?landingId=1' },
  // { name: 'List Payments', method: 'GET', path: '/api/payments' },
  // { name: 'List Subscriptions', method: 'GET', path: '/api/subscriptions' }
]

interface Endpoint {
  name: string;
  method: string;
  path: string;
  body?: any;
}

const results = reactive<Record<string, string>>({})

async function callEndpoint(endpoint: Endpoint) {
  results[endpoint.name] = 'Loading...'
  const url = envInfo.value.baseUrl + endpoint.path
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

<style scoped>
.debug-page {
  padding: 20px 0;
}

.debug-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.debug-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.debug-section p {
  margin: 8px 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}
</style>