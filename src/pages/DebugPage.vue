<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
</script>

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
        <p><strong>Mode:</strong> {{ import.meta.env.MODE }}</p>
        <p><strong>Base URL:</strong> {{ import.meta.env.BASE_URL }}</p>
      </div>
    </div>
  </AppPage>
</template>

<style scoped>
.debug-page {
  padding: 20px 0;
}

.debug-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
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