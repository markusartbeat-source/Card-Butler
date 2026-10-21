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
        :name="element.name"
        :content="elementValues[element.id]"
        :placeholder="markEmptyElements ? element.name : undefined"
        :highlight-search="highlightSearch"
        :editable="editableElements"
        :wraps-lines="element.width !== null"
        :horizontal-alignment="element.horizontalAlignment"
        :vertical-alignment="element.verticalAlignment"
        :font-family="element.fontFamily"
        :font-size="element.fontSize"
        :color="element.color"
        :style="elementStyle(element)"
        @update:content="emit('changeElementValue', element.id, $event)"
      />
      <CbPictureElement
        v-else-if="element.type === 'picture'"
        :id="element.id"
        :name="element.name"
        :opacity="element.opacity"
        :corner-radii="element.cornerRadii"
        :mark-if-empty="markEmptyElements"
        :editable="editableElements"
        :style="elementStyle(element)"
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
import CbPictureElement from '../../cardElements/picture/CbPictureElement.vue'
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

// Lage, Größe (mm) und Deckkraft eines Elements. Ohne Breite bzw. Höhe wächst es
// mit seinem Inhalt – undefined löscht dabei auch die px, die die Anfasser beim
// Ziehen setzen. Beim Bild gilt die Deckkraft nur dem Bild im Rahmen, das setzt
// es selbst.
function elementStyle(element: CardElement) {
  return {
    ...placementStyle(element.placement),
    width: element.width === null ? undefined : `${element.width}mm`,
    height: element.height === null ? undefined : `${element.height}mm`,
    opacity: element.type === 'picture' ? undefined : element.opacity,
  }
}
</script>
