<template>
  <!-- Every card of the project, much smaller than on the project page. The
       cards wrap into the next row on their own, so a narrow window simply
       shows fewer per row — at the width of the design it is six. More cards
       than fit are scrolled to; content-start keeps a short list at the top
       instead of spreading it, justify-center the rows in the middle so no
       row sticks to the left edge. -->
  <div
    ref="gridElement"
    class="flex min-w-0 grow flex-wrap content-start justify-center gap-3 overflow-y-auto"
  >
    <!-- Display only: pointer-events-none takes the cards out of every mouse
         event, so they cannot be clicked, dragged or stood on with a live
         cursor — the scrolling of the grid itself stays. -->
    <CbCard
      v-for="card in cards"
      :key="card.id"
      :id="card.id"
      :number="card.number"
      :element-values="card.elementValues"
      :zoom="exportZoom"
      class="pointer-events-none"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbCard from '../components/atoms/CbCard.vue'
import { exportZoom } from '../card/cardFormat'
import type { ExportCard } from './exportCard'

defineProps<{ cards: ExportCard[] }>()

// The dialog reads the drawn cards out of here to photograph them.
const gridElement = ref<HTMLElement>()
defineExpose({ gridElement })
</script>
