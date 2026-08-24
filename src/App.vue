<template>
  <div class="bg-background flex min-h-screen">
    <CbSidebar />
    <main class="flex-1 p-3">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import CbSidebar from './components/organisms/CbSidebar.vue'
</script>
