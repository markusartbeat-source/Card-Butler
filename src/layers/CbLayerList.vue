<template>
  <div class="flex flex-col gap-6">
    <p class="cb-regular-text">{{ dictionary.cardEditor.layersHint }}</p>
    <!-- Ziehen sortiert die Ebenen um, per Tastatur Alt+Pfeil. Die Position
         steht für Screenreader in der aria-description. Je Ebene lässt ein
         Knopf das Element auf der Karte aufglänzen (die Liste bleibt), der
         andere wählt es aus – dann wechselt das Panel zum Element. -->
    <VueDraggable
      v-model="topLayerFirst"
      v-bind="dragOptions"
      tag="ul"
      class="flex flex-col gap-3 select-none"
      :class="notStoredClass"
      @start="isDraggingLayer = true"
      @end="releaseLayerDrag"
    >
      <li v-for="(element, index) in topLayerFirst" :key="element.id">
        <CbLayerRow
          :element="element"
          :card="card"
          :card-color="cardSet.data.color"
          :position-description="dictionary.cardEditor.layerPosition(index + 1, topLayerFirst.length)"
          @shine="shineLayer(element)"
          @select="selectLayer(element)"
          @sort-key="sortLayerWithAltArrow($event, element)"
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
import { selectElement } from '../elementTransform/elementSelection'
import { sortWithAltArrow } from '../keyboard/sortWithAltArrow'
import { notStoredClass } from '../notStored/notStoredMark'
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

// Ein beendetes Ziehen löst danach noch einen Klick auf einen Knopf aus – der
// zählt nicht. Darum endet das Ziehen erst nach diesem Klick.
const isDraggingLayer = ref(false)

function releaseLayerDrag() {
  setTimeout(() => (isDraggingLayer.value = false), 0)
}

function shineLayer(element: CardSetElement) {
  if (!isDraggingLayer.value) shiningElementId.value = element.id
}

function selectLayer(element: CardSetElement) {
  if (!isDraggingLayer.value) selectElement(element.id)
}
</script>
