<template>
  <!-- One element: it is the card. data-card-id lets the cursor logic find out
       which card the mouse is on. -->
  <div
    class="cb-card-face relative bg-white shadow-lg"
    :class="highlightColor ? 'outline-2 outline-offset-2' : ''"
    :style="{ ...cardFormatStyle(cardFormat), zoom, outlineColor: highlightColor }"
    :data-card-id="id"
  >
    <!-- Every element type brings its own component from its folder. -->
    <template v-for="element in elementsOnThisSide" :key="element.id">
      <CbTextElement
        v-if="element.type === 'text'"
        :id="element.id"
        :content="elementValues[element.id]"
        :placeholder="markEmptyElements ? element.name : undefined"
        :highlight-search="highlightSearch"
        :editable="editableElements"
        :style="elementStyle(element)"
        @update:content="emit('changeElementValue', element.id, $event)"
      />
    </template>
    <!-- On top of the card, e.g. the cursors of other people. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  cardElementFromCardSetElement,
  type CardElement,
  type CardElementValues,
  type CardSide,
} from '../../cardElements/cardElements'
import type { CardSetElement } from '../../cardSets/cardSets'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'
import { placementStyle } from '../../elementTransform/elementPlacement'
import CbTextElement from '../../cardElements/text/CbTextElement.vue'

// The card is always its real size — zoom is the only thing a view decides.
// highlightColor draws a thin frame in the colour of the person standing here.
// elements sind die Elemente des Sets, elementValues this card's own contents.
// highlightSearch marks the search hits in the texts — only the overview wants that.
// side says which face of the card this is — only that side's elements show.
// markEmptyElements zeigt leere Elemente mit Rahmen und Namen – nur der Editor
// will das, damit man sie sieht und anklicken kann. editableElements lässt in
// die Felder tippen, changeElementValue meldet dann den neuen Inhalt.
const props = withDefaults(
  defineProps<{
    id: string
    elements: CardSetElement[]
    zoom?: number
    highlightColor?: string
    elementValues?: CardElementValues
    highlightSearch?: boolean
    side?: CardSide
    markEmptyElements?: boolean
    editableElements?: boolean
  }>(),
  {
    zoom: gridZoom,
    elementValues: () => ({}),
    highlightSearch: false,
    side: 'front',
    markEmptyElements: false,
    editableElements: false,
  },
)

const emit = defineEmits<{ changeElementValue: [elementId: string, value: string] }>()

const elementsOnThisSide = computed(() =>
  props.elements
    .map(cardElementFromCardSetElement)
    .filter((element): element is CardElement => element?.side === props.side),
)

// Lage, Größe (mm) und Deckkraft eines Elements.
function elementStyle(element: CardElement) {
  return {
    ...placementStyle(element.placement),
    width: `${element.width}mm`,
    height: `${element.height}mm`,
    opacity: element.opacity,
  }
}
</script>
