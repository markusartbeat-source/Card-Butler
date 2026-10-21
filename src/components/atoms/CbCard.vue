<template>
  <!-- Der Rahmen: die Karte in Kartenfarbe, mit showBleed samt Anschnitt
       ringsum (Innenabstand). Was darüber hinausragt, schneidet er ab.
       data-card-id lets the cursor logic find out which card the mouse is on. -->
  <div
    class="cb-card-face relative box-content overflow-hidden shadow-lg"
    :class="highlightColor ? 'outline-2 outline-offset-2' : ''"
    :style="frameStyle"
    :data-card-id="id"
  >
    <!-- Die eigentliche Karte, um den Anschnitt eingerückt. Sie ist der
         Nullpunkt der Elemente – der Anschnitt verschiebt also keins. -->
    <div class="relative size-full" data-card-surface>
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
        :class="{ 'cb-shine': editableElements && element.id === shiningElementId }"
        @change-value="emit('changeElementValue', element.id, $event)"
        @animationend="endShine"
      />
      <!-- Die Schnittlinie zeigt, wo die Karte ausgeschnitten wird – über den
           Elementen, Klicks gehen durch sie hindurch. -->
      <div
        v-if="showCutLine"
        class="pointer-events-none absolute inset-0 rounded-(--card-corner-radius-mm) border border-gold"
      />
      <!-- On top of the card, e.g. the cursors of other people. -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardElementValues } from '../../cardElements/cardValues'
import type { CardSetData } from '../../api/cardSets/cardSetsApi'
import type { CardSetElement } from '../../cardSets/cardSets'
import { cardFormatStyle, gridZoom } from '../../card/cardFormat'
import CbCardElement from '../../cardElements/CbCardElement.vue'
import { endShine, shiningElementId } from '../../cardElements/elementShine'

// The card is always its real size — zoom is the only thing a view decides.
// highlightColor draws a thin frame in the colour of the person standing here.
// elements sind die Elemente des Sets, values das, was diese Karte einträgt.
// highlightSearch marks the search hits in the texts — only the overview wants that.
// side ist die Seite der Karte – das Backend kennt keine, alle Elemente liegen vorn.
// markEmptyElements zeigt leere Elemente mit Rahmen und Namen – nur der Editor
// will das, damit man sie sieht und anklicken kann. editableElements lässt in
// die Felder tippen, changeElementValue meldet dann den neuen Inhalt. Nur dann
// glänzt auch ein Element auf (siehe elementShine).
// cardSetData sind die Einstellungen des Sets (Größe, Farbe, Anschnitt). showBleed
// zeigt den Anschnitt rund um die Karte, showCutLine die goldene Schnittlinie –
// beides will bisher nur der Editor. coverBleed verdeckt den Anschnitt, ohne den
// Rahmen zu verkleinern – so fliegt die Editor-Karte wie die in der Übersicht.
const props = withDefaults(
  defineProps<{
    id: string
    elements: CardSetElement[]
    cardSetData: CardSetData
    showBleed?: boolean
    showCutLine?: boolean
    coverBleed?: boolean
    zoom?: number
    highlightColor?: string
    values?: CardElementValues
    highlightSearch?: boolean
    side?: 'front' | 'back'
    markEmptyElements?: boolean
    editableElements?: boolean
  }>(),
  {
    showBleed: false,
    showCutLine: false,
    coverBleed: false,
    zoom: gridZoom,
    values: () => ({}),
    highlightSearch: false,
    side: 'front',
    markEmptyElements: false,
    editableElements: false,
  },
)

const emit = defineEmits<{ changeElementValue: [elementId: string, value: string] }>()

// Die Farbe des Sets füllt auch den Anschnitt. bleedWidth gilt links und rechts
// je, bleedHeight oben und unten je. Verdeckt schneidet der Rahmen an der
// Kartenkante ab, mit deren runden Ecken – style.css lässt den Wechsel gleiten.
const frameStyle = computed(() => {
  const { color, bleedWidth, bleedHeight } = props.cardSetData
  const bleed = `${bleedHeight}mm ${bleedWidth}mm`
  return {
    ...cardFormatStyle(props.cardSetData),
    zoom: props.zoom,
    backgroundColor: color,
    outlineColor: props.highlightColor,
    padding: props.showBleed ? bleed : 0,
    clipPath: props.showBleed
      ? `inset(${props.coverBleed ? bleed : 0} round var(--card-corner-radius-mm))`
      : undefined,
  }
})

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
