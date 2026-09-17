<template>
  <!-- Lies over the whole card while its print count is being changed: the
       editor's dim layer with the stack icon and the count in the middle.
       Layout from the Figma frame 230:9826 — its grey is left out, the dim
       layer's look wins. The corner radius follows the card: 3 mm at the
       grid zoom is about 9 px, "rounded-lg" is 8. -->
  <CbDimLayer
    class="pointer-events-none flex flex-col items-center justify-center gap-2 rounded-lg text-white"
  >
    <CbIcon name="stacks" size="large" />
    <span class="text-display leading-none">x{{ count }}</span>
  </CbDimLayer>
</template>

<script setup lang="ts">
import CbDimLayer from '../components/atoms/CbDimLayer.vue'
import CbIcon from '../components/atoms/CbIcon.vue'

defineProps<{ count: number }>()
</script>
