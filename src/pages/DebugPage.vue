<template>
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
</template>

<script setup>
import { reactive } from 'vue'

const apiBase = import.meta.env.VITE_API_BASE || ''

import { initData } from '@telegram-apps/sdk-vue';
const endpoints = [
  { name: 'Auth/Login', method: 'POST', path: '/api/auth/login', body: { initData } },
  { name: 'List Landings', method: 'GET', path: '/api/landings' },
  { name: 'Create Landing', method: 'POST', path: '/api/landings', body: { title: 'Test', description: 'Debug', avatarUrl: '' } },
  { name: 'List Links', method: 'GET', path: '/api/links?landingId=1' },
  { name: 'List Leads', method: 'GET', path: '/api/leads' },
  { name: 'List Analytics', method: 'GET', path: '/api/analytics?landingId=1' },
  { name: 'List Payments', method: 'GET', path: '/api/payments' },
  { name: 'List Subscriptions', method: 'GET', path: '/api/subscriptions' }
]

const results = reactive({})

async function callEndpoint(endpoint) {
  results[endpoint.name] = 'Loading...'
  const url = apiBase + endpoint.path
  try {
    const res = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...(endpoint.name !== 'Auth/Login' ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
      },
      body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
    })
    const text = await res.text()
    results[endpoint.name] = text
  } catch (err) {
    results[endpoint.name] = err.message
  }
}
</script>