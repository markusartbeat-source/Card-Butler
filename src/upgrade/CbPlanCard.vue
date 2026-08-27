<template>
  <!-- One price plan: name, short subtitle and the price. -->
  <div class="w-72 rounded-2xl bg-surface p-6 text-white">
    <h2 class="text-xl font-bold">{{ name }}</h2>
    <p class="mt-1 text-sm text-white/70">{{ subtitle }}</p>
    <p class="mt-6 text-4xl font-bold">{{ price }}€</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string; subtitle: string; price: number }>()
</script>
