<template>
  <div class="bg-background flex min-h-screen">
    <CbSidebar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import CbSidebar from './components/organisms/CbSidebar.vue'
</script>
