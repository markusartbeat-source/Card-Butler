<template>
  <!-- Das Element so, wie es die offene Karte zeigt: ungedreht, auf dem Grund
       der Karte, in die Box eingepasst, leer gestrichelt. Bedienen lässt es
       sich hier nicht – ein Klick gilt der Zeile. Der Screenreader hört nur den
       Namen der Zeile, nicht den Inhalt des Bilds. -->
  <div
    ref="box"
    class="pointer-events-none flex h-13 w-13.25 shrink-0 items-center justify-center overflow-hidden rounded"
    :style="{ backgroundColor: cardColor }"
    aria-hidden="true"
  >
    <!-- Die Lage gibt wie auf der Karte der Aufrufer vor. relative hält z.B. das
         Bild im Rahmen des Bild-Elements. -->
    <div ref="drawing" class="flex" :style="{ zoom }">
      <CbCardElement
        class="relative"
        :element="element"
        :card-id="card.id"
        :values="card.values"
        mark-if-empty
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { measureInMillimeters, millimetersToPixels } from '../card/millimeters'
import CbCardElement from '../cardElements/CbCardElement.vue'
import type { Card, CardSetElement } from '../cardSets/cardSets'

// card ist die offene Karte, ihre Werte (Text, Bild) zeigt das Element.
// cardColor ist die Farbe der Karte (Hex aus dem Backend).
defineProps<{ element: CardSetElement; card: Card; cardColor: string }>()

const box = useTemplateRef<HTMLElement>('box')
const drawing = useTemplateRef<HTMLElement>('drawing')
const zoom = ref(1)

// Misst das Element – auch ein Textfeld, das mit seinem Text wächst – und
// vergrößert bzw. verkleinert es so, dass es die Box gerade ausfüllt. Gemessen
// wird ohne Zoom, ein neuer Zoom ändert das Maß also nicht.
function fitIntoBox() {
  const shownElement = drawing.value?.firstElementChild
  if (!box.value || !(shownElement instanceof HTMLElement)) return
  const { width, height } = measureInMillimeters(shownElement)
  if (!width || !height) return
  zoom.value = Math.min(
    box.value.clientWidth / millimetersToPixels(width),
    box.value.clientHeight / millimetersToPixels(height),
  )
}

// Meldet jede Größenänderung des Elements, z.B. einen neuen Text.
const resizeObserver = new ResizeObserver(fitIntoBox)

onMounted(() => {
  if (drawing.value) resizeObserver.observe(drawing.value)
})

onUnmounted(() => resizeObserver.disconnect())
</script>
