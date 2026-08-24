<template>
  <div class="bg-background flex min-h-screen">
    <CbSidebar />
    <main class="flex-1 p-3">
      <router-view />
    </main>
    <CbToaster />
  </div>
</template>

<script setup lang="ts">
import CbSidebar from './components/organisms/CbSidebar.vue'
import CbToaster from './components/atoms/CbToaster.vue'
</script>
