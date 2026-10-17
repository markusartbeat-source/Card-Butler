<template>
  <div class="bg-surface rounded-2xl p-6">
    <!-- Titel mit einem goldenen Strich links und rechts, die den Platz daneben
         füllen. Statt des Titels kann eigener Inhalt dazwischen stehen. -->
    <div class="flex items-center justify-center gap-3">
      <span class="bg-gold h-px min-w-4.5 grow"></span>
      <slot name="title">
        <h2 class="text-xl text-white">{{ title }}</h2>
      </slot>
      <span class="bg-gold h-px min-w-4.5 grow"></span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Fläche mit Titel, z.B. die Einstellungen rechts im Karten-Editor.
defineProps<{ title?: string }>()
</script>
