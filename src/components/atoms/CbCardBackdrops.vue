<template>
  <!-- The sheets stacked behind a card that is printed more than once: one for
       two copies, two from three up, never more. Each is a card-sized face pushed
       a little to the bottom right. The root fills the card's cell and is
       positioned, so the faces (which are transformed) paint over it. The offset
       sits on a wrapper without zoom, so it stays in real page pixels. -->
  <div class="cb-card-backdrops relative">
    <div v-if="count >= 3" class="absolute inset-0 translate-2">
      <div class="cb-card-face bg-card-backdrop-far" :style="faceStyle" />
    </div>
    <div v-if="count >= 2" class="absolute inset-0 translate-1">
      <div class="cb-card-face bg-card-backdrop-near" :style="faceStyle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'

defineProps<{ count: number }>()

const faceStyle = computed(() => ({ ...cardFormatStyle(cardFormat.value), zoom: gridZoom }))
</script>
