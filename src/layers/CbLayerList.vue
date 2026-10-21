<template>
  <div class="flex flex-col gap-6 text-white">
    <p class="text-sm">{{ dictionary.cardEditor.layersHint }}</p>
    <ul class="flex flex-col gap-3">
      <CbLayerRow v-for="element in topLayerFirst" :key="element.id" :element="element" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardSetElement } from '../cardSets/cardSets'
import CbLayerRow from './CbLayerRow.vue'

// Die Elemente des Sets – das letzte liegt auf der Karte obenauf.
const props = defineProps<{ elements: CardSetElement[] }>()

// Die oberste Ebene steht oben in der Liste.
const topLayerFirst = computed(() => [...props.elements].reverse())
</script>
