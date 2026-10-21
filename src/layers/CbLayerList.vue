<template>
  <div class="flex flex-col gap-6 text-white">
    <p class="text-sm">{{ dictionary.cardEditor.layersHint }}</p>
    <!-- Ziehen sortiert die Ebenen um, per Tastatur Alt+Pfeil. Die Position
         steht für Screenreader in der aria-description. Ein Klick (Enter,
         Leertaste) lässt das Element auf der Karte aufglänzen, ohne es
         auszuwählen – sonst wechselte das Panel und die Liste wäre weg. -->
    <VueDraggable
      v-model="topLayerFirst"
      v-bind="dragOptions"
      tag="ul"
      class="flex flex-col gap-3 select-none"
      @start="isDraggingLayer = true"
      @end="releaseLayerDrag"
    >
      <li v-for="(element, index) in topLayerFirst" :key="element.id">
        <CbLayerRow
          :element="element"
          :card="card"
          :aria-keyshortcuts="sortingKeyShortcuts"
          :aria-description="dictionary.cardEditor.layerPosition(index + 1, topLayerFirst.length)"
          @click="shineLayer(element)"
          @keydown="sortLayerWithAltArrow($event, element)"
        />
      </li>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { shiningElementId } from '../cardElements/elementShine'
import type { Card, CardSet, CardSetElement } from '../cardSets/cardSets'
import { dragOptions } from '../dragAndDrop/dragOptions'
import { sortingKeyShortcuts, sortWithAltArrow } from '../keyboard/sortWithAltArrow'
import CbLayerRow from './CbLayerRow.vue'
import { rememberLayerOrder } from './layerOrder'

// Die Elemente des Sets sind die Ebenen – das letzte liegt auf der Karte
// obenauf. card ist die offene Karte, ihre Werte zeigen die Vorschaubilder.
const props = defineProps<{ cardSet: CardSet; card: Card }>()

// Die oberste Ebene steht oben in der Liste. Eine neue Reihenfolge geht
// umgedreht zurück ans Set – in dieselbe Liste, nicht als neue: Ein
// „Rückgängig“ nach dem Löschen eines Elements setzt es in diese Liste zurück.
// Der Browser merkt sie sich, das Backend kennt keine.
const topLayerFirst = computed({
  get: () => [...props.cardSet.elements].reverse(),
  set: (layers) => {
    const { elements } = props.cardSet
    elements.splice(0, elements.length, ...[...layers].reverse())
    rememberLayerOrder(props.cardSet)
  },
})

// Alt+Pfeil stellt die umgedrehte Kopie um, die neue Reihenfolge geht übers Setzen ans Set.
function sortLayerWithAltArrow(event: KeyboardEvent, element: CardSetElement) {
  sortWithAltArrow(event, topLayerFirst.value, element, (layers) => (topLayerFirst.value = layers))
}

// Ein beendetes Ziehen löst danach noch einen Klick auf die Zeile aus – der
// glänzt nicht. Darum endet das Ziehen erst nach diesem Klick.
const isDraggingLayer = ref(false)

function releaseLayerDrag() {
  setTimeout(() => (isDraggingLayer.value = false), 0)
}

function shineLayer(element: CardSetElement) {
  if (!isDraggingLayer.value) shiningElementId.value = element.id
}
</script>
