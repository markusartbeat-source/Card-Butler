<template>
  <!-- The cards a second time, only for the export. Chrome and Safari ignore
       CSS zoom inside the SVG snapdom builds, so the small cards of the visible
       grid cannot be photographed — this copy is drawn at zoom 1, its real
       millimetres. fixed left-full parks it just outside the window: the browser
       still lays it out, but nobody sees it and no scroll bar appears. -->
  <div ref="stageElement" class="pointer-events-none fixed top-0 left-full" aria-hidden="true">
    <CbCard
      v-for="card in cards"
      :key="card.id"
      :id="card.id"
      :number="card.number"
      :element-values="card.elementValues"
      :zoom="1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbCard from '../../components/atoms/CbCard.vue'
import type { ExportCard } from '../exportCard'

defineProps<{ cards: ExportCard[] }>()

// The dialog reads the cards out of here to photograph them.
const stageElement = ref<HTMLElement>()
defineExpose({ stageElement })
</script>
