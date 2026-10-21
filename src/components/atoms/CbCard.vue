<template>
  <!-- One element: it is the card. data-card-id lets the cursor logic find out
       which card the mouse is on. -->
  <div
    class="cb-card-face relative bg-white shadow-lg"
    :class="highlightColor ? 'outline-2 outline-offset-2' : ''"
    :style="{ ...cardFormatStyle(cardFormat), zoom, outlineColor: highlightColor }"
    :data-card-id="id"
  >
    <CbCardElement
      v-for="element in elementsOnThisSide"
      :key="element.id"
      :element="element"
      :card-id="id"
      :values="values"
      :mark-if-empty="markEmptyElements"
      :editable="editableElements"
      :highlight-search="highlightSearch"
      :style="placementStyle(element)"
      @change-value="emit('changeElementValue', element.id, $event)"
    />
    <!-- On top of the card, e.g. the cursors of other people. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardElementValues } from '../../cardElements/cardValues'
import type { CardSetElement } from '../../cardSets/cardSets'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'
import CbCardElement from '../../cardElements/CbCardElement.vue'

// The card is always its real size — zoom is the only thing a view decides.
// highlightColor draws a thin frame in the colour of the person standing here.
// elements sind die Elemente des Sets, values das, was diese Karte einträgt.
// highlightSearch marks the search hits in the texts — only the overview wants that.
// side ist die Seite der Karte – das Backend kennt keine, alle Elemente liegen vorn.
// markEmptyElements zeigt leere Elemente mit Rahmen und Namen – nur der Editor
// will das, damit man sie sieht und anklicken kann. editableElements lässt in
// die Felder tippen, changeElementValue meldet dann den neuen Inhalt.
const props = withDefaults(
  defineProps<{
    id: string
    elements: CardSetElement[]
    zoom?: number
    highlightColor?: string
    values?: CardElementValues
    highlightSearch?: boolean
    side?: 'front' | 'back'
    markEmptyElements?: boolean
    editableElements?: boolean
  }>(),
  {
    zoom: gridZoom,
    values: () => ({}),
    highlightSearch: false,
    side: 'front',
    markEmptyElements: false,
    editableElements: false,
  },
)

const emit = defineEmits<{ changeElementValue: [elementId: string, value: string] }>()

// Gezeichnet werden bisher nur Textfelder, Bilder, Vierecke und Kreise mit
// x/y-Position; andere (z.B. von einer KI per MCP angelegt) fehlen noch.
function isDrawn({ data }: CardSetElement) {
  const { x, y } = data.position
  return ['TEXT', 'PICTURE', 'SQUARE', 'CIRCLE'].includes(data.type) && x != null && y != null
}

const elementsOnThisSide = computed(() =>
  props.side === 'back' ? [] : props.elements.filter(isDrawn),
)

// Lage (mm) und Drehung eines Elements, Größe und Deckkraft setzt es selbst. Die
// Drehung geht über „transform“: Moveable liest es, um seinen Rahmen im selben
// Winkel zu zeichnen.
function placementStyle({ data, rotation }: CardSetElement) {
  return {
    position: 'absolute' as const,
    left: `${data.position.x}mm`,
    top: `${data.position.y}mm`,
    transform: `rotate(${rotation}deg)`,
  }
}
</script>
