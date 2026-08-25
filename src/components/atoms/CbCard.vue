<template>
  <!-- data-card-id lets the cursor logic find out which card the mouse is on. -->
  <div
    class="cb-card relative"
    :class="[shapeClasses, highlightColor ? 'outline-2 outline-offset-2' : '']"
    :style="highlightColor ? { outlineColor: highlightColor } : undefined"
    :data-card-id="id"
  >
    <!-- The inner face carries the look, so dragging can transform it while
         the sort library controls the transform of the outer element. -->
    <div
      class="cb-card-face flex h-full w-full flex-col items-center justify-center gap-2 bg-white shadow-lg"
    >
      <span class="text-5xl font-bold text-background">{{ number }}</span>
      <!-- Temporary: shows that the id sticks to the card while sorting. -->
      <span class="text-xs text-background/50">{{ id }}</span>
    </div>
    <!-- Overlay on top of the card face, e.g. the cursors of other people. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// Each card decides its own size and shape via shapeClasses.
// highlightColor draws a thin frame in the colour of the person standing here.
withDefaults(
  defineProps<{
    id: string
    number: number
    shapeClasses?: string
    highlightColor?: string
  }>(),
  { shapeClasses: 'h-72 w-48 rounded-2xl' },
)
</script>
