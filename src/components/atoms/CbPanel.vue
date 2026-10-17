<template>
  <div class="bg-surface rounded-2xl p-6">
    <!-- Titel mit einem kurzen goldenen Strich links und rechts. -->
    <div class="flex items-center justify-center gap-3">
      <span class="bg-gold h-px w-4.5"></span>
      <h2 class="text-xl text-white">{{ title }}</h2>
      <span class="bg-gold h-px w-4.5"></span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Fläche mit Titel, z.B. die Einstellungen rechts im Karten-Editor.
defineProps<{ title: string }>()
</script>
