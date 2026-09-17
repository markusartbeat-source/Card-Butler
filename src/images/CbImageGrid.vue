<template>
  <!-- A justified gallery: every row is 302px high, each picture starts at
       the width its aspect ratio gives it and grows in proportion until the
       row is filled, exactly like the rows in the design. -->
  <div class="flex flex-wrap gap-3">
    <div
      v-for="image in images"
      :key="image.id"
      :id="image.id"
      class="h-75.5 rounded-lg bg-gradient-to-br"
      :class="image.gradientClasses"
      :style="tileStyle(image)"
    />
  </div>
</template>

<script setup lang="ts">
import type { DummyImage } from './dummyImages'

defineProps<{ images: DummyImage[] }>()

const rowHeight = 302

function tileStyle(image: DummyImage) {
  const ratio = image.ratioWidth / image.ratioHeight
  return { flexBasis: `${rowHeight * ratio}px`, flexGrow: ratio }
}
</script>
