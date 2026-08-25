<template>
  <!-- x and y are percentages inside the card the cursor is anchored to. -->
  <div
    class="cb-cursor animate-cb-cursor-arrive pointer-events-none absolute flex origin-top-left items-start gap-1"
    :style="{ left: `${x}%`, top: `${y}%` }"
  >
    <svg class="h-4 w-4 shrink-0" viewBox="0 0 16 16" :fill="color" aria-hidden="true">
      <path d="M1 1 L1 13 L4.4 9.9 L6.8 14.6 L9.1 13.4 L6.8 8.8 L11.4 8.4 Z" />
    </svg>
    <span
      class="rounded-md px-2 py-0.5 text-xs whitespace-nowrap text-background"
      :style="{ backgroundColor: color }"
    >
      {{ name }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ x: number; y: number; name: string; color?: string }>(), {
  color: 'var(--color-gold)',
})
</script>
