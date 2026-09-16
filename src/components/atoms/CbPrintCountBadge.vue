<template>
  <!-- Glass pill from the Figma design: shows how many copies a card is
       printed as, e.g. "x3". -->
  <span
    class="flex items-center gap-0.5 rounded-full bg-white/20 p-0.5 text-2xs leading-none text-background backdrop-blur-sm text-shadow-2xs text-shadow-black/25"
  >
    <CbIcon name="stacks" size="small" />
    x{{ count }}
  </span>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'

defineProps<{ count: number }>()
</script>
