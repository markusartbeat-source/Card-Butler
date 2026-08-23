<template>
  <div class="cb-card" :class="shapeClasses">
    <!-- The inner face carries the look, so dragging can transform it while
         the sort library controls the transform of the outer element. -->
    <div
      class="cb-card-face flex h-full w-full items-center justify-center bg-white shadow-lg"
    >
      <span class="text-5xl font-bold text-background">{{ number }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Each card decides its own size and shape via shapeClasses.
withDefaults(defineProps<{ number: number; shapeClasses?: string }>(), {
  shapeClasses: 'h-72 w-48 rounded-2xl',
})
</script>
