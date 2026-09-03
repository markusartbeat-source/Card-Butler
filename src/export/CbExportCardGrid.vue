<template>
  <!-- Every card of the project, six per row and much smaller than on the
       project page. The width is the left half of the dialog: six 145 px cards
       with 12 px between them. More cards than fit are scrolled to.
       content-start keeps a short list at the top instead of spreading it. -->
  <div class="grid w-233 grid-cols-6 content-start gap-3 overflow-y-auto">
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
import CbCard from '../components/atoms/CbCard.vue'
import { exportZoom } from '../card/cardFormat'
import type { ExportCard } from './exportCard'

defineProps<{ cards: ExportCard[] }>()
</script>
