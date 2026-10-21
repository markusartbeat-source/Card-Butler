<template>
  <div class="flex flex-col gap-6 text-white">
    <p class="text-sm">{{ dictionary.cardEditor.layersHint }}</p>
    <!-- Ziehen sortiert die Ebenen um, per Tastatur Alt+Pfeil. Die Position
         steht für Screenreader in der aria-description. -->
    <VueDraggable
      v-model="topLayerFirst"
      v-bind="dragOptions"
      tag="ul"
      class="flex flex-col gap-3 select-none"
    >
      <li v-for="(element, index) in topLayerFirst" :key="element.id">
        <CbLayerRow
          :element="element"
          :card="card"
          :aria-keyshortcuts="sortingKeyShortcuts"
          :aria-description="dictionary.cardEditor.layerPosition(index + 1, topLayerFirst.length)"
          @keydown="sortLayerWithAltArrow($event, element)"
        />
      </li>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { Card, CardSetElement } from '../cardSets/cardSets'
import { dragOptions } from '../dragAndDrop/dragOptions'
import { sortingKeyShortcuts, sortWithAltArrow } from '../keyboard/sortWithAltArrow'
import CbLayerRow from './CbLayerRow.vue'

// Die Elemente des Sets – das letzte liegt auf der Karte obenauf. card ist die
// offene Karte, ihre Werte zeigen die Vorschaubilder.
const props = defineProps<{ elements: CardSetElement[]; card: Card }>()

// Die oberste Ebene steht oben in der Liste. Eine neue Reihenfolge geht
// umgedreht zurück ans Set – in dieselbe Liste, nicht als neue: Ein
// „Rückgängig“ nach dem Löschen eines Elements setzt es in diese Liste zurück.
const topLayerFirst = computed({
  get: () => [...props.elements].reverse(),
  set: (layers) => {
    props.elements.splice(0, props.elements.length, ...[...layers].reverse())
  },
})

// Alt+Pfeil stellt die umgedrehte Kopie um, die neue Reihenfolge geht übers Setzen ans Set.
function sortLayerWithAltArrow(event: KeyboardEvent, element: CardSetElement) {
  sortWithAltArrow(event, topLayerFirst.value, element, (layers) => (topLayerFirst.value = layers))
}
</script>
