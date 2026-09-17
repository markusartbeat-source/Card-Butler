<template>
  <CbDimLayer
    class="pointer-events-none flex flex-col items-center justify-center gap-2 text-white"
  >
    <!-- Lies over the whole card while its print count is being changed: the
         editor's dim layer with the stack icon and the count in the middle.
         Layout from the Figma frame 230:9826 — its grey is left out, the dim
         layer's look wins. The corner radius comes from the caller, because
         the card is drawn at a different zoom in the grid and in the editor.
         The comment sits inside the root on purpose: next to it, the caller's
         Transition would fade an empty text node instead of this layer. -->
    <CbIcon name="stacks" size="large" />
    <!-- Old and new number share one cell, so the old one slides out while the
         new one slides in — upwards when the count grows, downwards when it
         shrinks. The box cuts off whatever is outside. -->
    <div class="grid justify-items-center overflow-hidden text-display leading-none">
      <!-- Keeps the box as wide as the widest count, so nothing jumps when the
           number gets a digit more or less (9 → 10). -->
      <span class="invisible col-start-1 row-start-1">x{{ maxPrintCount }}</span>
      <Transition :name="slideDirection">
        <span :key="count" class="col-start-1 row-start-1">x{{ count }}</span>
      </Transition>
    </div>
  </CbDimLayer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import CbDimLayer from '../components/atoms/CbDimLayer.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import { maxPrintCount } from './changePrintCountByWheel'

const props = defineProps<{ count: number }>()

const slideDirection = ref<'up' | 'down'>('up')

watch(
  () => props.count,
  (newCount, oldCount) => (slideDirection.value = newCount > oldCount ? 'up' : 'down'),
)
</script>

<style scoped>
.up-enter-active,
.up-leave-active,
.down-enter-active,
.down-leave-active {
  transition: translate 350ms ease-out;
}

/* More than the number's own height, so the two never touch on the way. */
.up-enter-from,
.down-leave-to {
  translate: 0 150%;
}

.up-leave-to,
.down-enter-from {
  translate: 0 -150%;
}
</style>
