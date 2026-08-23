<template>
  <div
    class="flex items-center justify-center bg-white shadow-lg"
    :class="shapeClasses"
  >
    <span class="text-5xl font-bold text-background">{{ number }}</span>
  </div>
</template>

<script setup lang="ts">
// Each card decides its own size and shape via shapeClasses.
withDefaults(defineProps<{ number: number; shapeClasses?: string }>(), {
  shapeClasses: 'h-72 w-48 rounded-2xl',
})
</script>
