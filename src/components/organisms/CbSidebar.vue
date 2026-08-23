<template>
  <div class="h-screen w-64 shrink-0 p-3">
    <div class="bg-surface flex h-full w-full flex-col items-center gap-3 rounded-3xl p-3 shadow-lg">
      <img src="../../assets/logos/logo.png" alt="Logo" class="w-10 -rotate-1 drop-shadow-lg" />
      <div class="flex w-full items-center gap-1.5 rounded-xl p-2.5 text-white">
        <CbIcon name="home" />
        <span class="text-sm">Home</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'
</script>
