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
        v-if="element.data.type === 'TEXT'"
        :element="element"
        :content="values[element.id]?.text ?? ''"
        :placeholder="markEmptyElements ? element.data.name : undefined"
        :highlight-search="highlightSearch"
        :editable="editableElements"
        :style="elementStyle(element)"
        @update:content="emit('changeElementValue', element.id, $event)"
      />
      <CbPictureElement
        v-else
        :element="element"
        :picture="pictureOnThisCard(element.id)"
        :crop="pictureCropOnThisCard(element.id)"
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
import type { CardElementValues } from '../../cardElements/cardValues'
import type { CardSetElement } from '../../cardSets/cardSets'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'
import { knownImages } from '../../images/knownImages'
import CbPictureElement from '../../cardElements/picture/CbPictureElement.vue'
import { pictureCropOf } from '../../cardElements/picture/pictureCrops'
import CbTextElement from '../../cardElements/text/CbTextElement.vue'
import { textSizingOf } from '../../cardElements/text/textSizing'

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

// Gezeichnet werden bisher nur Textfelder und Bilder mit x/y-Position; andere
// (z.B. von einer KI per MCP angelegt) fehlen noch.
function isDrawn({ data }: CardSetElement) {
  const { x, y } = data.position
  return ['TEXT', 'PICTURE'].includes(data.type) && x != null && y != null
}

const elementsOnThisSide = computed(() =>
  props.side === 'back' ? [] : props.elements.filter(isDrawn),
)

// Das Bild, das diese Karte in einem Bild-Element zeigt, und sein Ausschnitt hier.
function pictureOnThisCard(elementId: string) {
  const imageId = props.values[elementId]?.imageId
  return imageId ? knownImages.value[imageId]?.location : undefined
}

function pictureCropOnThisCard(elementId: string) {
  const imageId = props.values[elementId]?.imageId
  return imageId ? pictureCropOf(props.id, elementId, imageId) : undefined
}

// Lage, Größe (mm), Drehung und Deckkraft eines Elements. Die Drehung geht über
// „transform“: Moveable liest es, um seinen Rahmen im selben Winkel zu zeichnen.
// Eine automatische Seite eines Textfelds bleibt offen und wächst mit dem
// Inhalt – undefined löscht dabei auch die px, die die Anfasser beim Ziehen
// setzen. Bilder haben immer eine feste Größe. Beim Bild gilt die Deckkraft nur
// dem Bild im Rahmen, das setzt es selbst.
function elementStyle(element: CardSetElement) {
  const { data, rotation } = element
  const sizing = textSizingOf(element)
  return {
    position: 'absolute' as const,
    left: `${data.position.x}mm`,
    top: `${data.position.y}mm`,
    transform: `rotate(${rotation}deg)`,
    width: sizing === 'autoWidth' ? undefined : `${data.width}mm`,
    height: sizing === 'fixed' ? `${data.height}mm` : undefined,
    opacity: data.type === 'PICTURE' ? undefined : data.opacity,
  }
}
</script>
