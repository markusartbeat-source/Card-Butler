<template>
  <!-- The library takes its props as a plain name list, so Vue does not turn a
       bare "draggable" into true — every switch needs an explicit value.
       rootContainer is the card: it is drawn with CSS zoom, and Moveable only
       counts that zoom into its angles when it knows the zoomed element.
       check-input: Im Tippmodus markiert Ziehen im Text, statt zu verschieben.
       edge-draggable: Ziehen an der Rahmenkante verschiebt – auch beim Tippen.
       line-padding macht die sonst 1 px dünne Kante nach außen greifbar.
       use-resize-observer: Wächst das Feld mit seinem Text (z.B. beim Tippen),
       misst Moveable neu – außer während es selbst zieht. -->
  <Moveable
    v-if="selectedElementNode"
    ref="moveable"
    class-name="cb-element-transform"
    :target="selectedElementNode"
    :root-container="card"
    :check-input="true"
    :draggable="true"
    :edge-draggable="true"
    :line-padding="8"
    :use-resize-observer="true"
    :resizable="true"
    :rotatable="true"
    :origin="false"
    @drag="applyDrag"
    @drag-end="finishDrag"
    @resize-start="setResizeStartSize"
    @resize="applyResize"
    @resize-end="finishResize"
    @rotate="applyRotate"
    @rotate-end="measureElementAgain"
  />
</template>

<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import Moveable, {
  type OnDrag,
  type OnDragEnd,
  type OnResize,
  type OnResizeEnd,
  type OnResizeStart,
  type OnRotate,
} from 'vue3-moveable'
import { selectedElementId, selectedElementNode } from './elementSelection'
import { millimetersToPixels, pixelsToMillimeters } from '../card/millimeters'
import {
  findCardSetElement,
  moveElementBy,
  resizeElement,
  rotateElementBy,
} from '../cardElements/cardElements'
import { saveElement } from '../cardElements/saveElement'

// The card the selected element lives in. Searching inside it instead of the
// whole page keeps us away from the same element on the other cards.
const props = defineProps<{ card: HTMLElement | null }>()

const moveable = useTemplateRef<InstanceType<typeof Moveable>>('moveable')

// Wait a tick, so the element is really in the page before we look for it.
watch(
  [selectedElementId, () => props.card],
  async ([id, card]) => {
    await nextTick()
    selectedElementNode.value =
      id && card ? card.querySelector<HTMLElement>(`[data-element-id="${id}"]`) : null
  },
  { immediate: true },
)

// Moveable already counts the card's zoom out of its numbers — they arrive in
// the element's own pixels, just like the width it hands us on resize.
// Moveable never changes the element itself — it hands us the new values and we
// write them onto the element. The position does not go onto the element as
// pixels though: it belongs to the element's placement, in millimetres, so it
// survives closing the editor and stays right at any zoom.
function applyDrag(event: OnDrag) {
  if (!selectedElementId.value) return

  moveElementBy(
    selectedElementId.value,
    pixelsToMillimeters(event.delta[0]),
    pixelsToMillimeters(event.delta[1]),
  )
}

// The element really moved, and not by a transform Moveable set itself — so it
// has to measure the box again, or the next drag starts from the old one.
async function measureElementAgain() {
  await nextTick()
  moveable.value?.updateRect()
}

// Kommt die neue Lage von außen (z.B. aus dem Einstellungs-Panel), bliebe der
// Rahmen sonst an der alten Stelle. Beim Ziehen misst Moveable selbst.
watch(
  () => selectedElementId.value && findCardSetElement(selectedElementId.value)?.data.position,
  () => {
    if (!moveable.value?.isDragging()) measureElementAgain()
  },
)

// Gespeichert wird erst am Ende, nicht bei jedem Schritt. Ein bloßer Klick aufs
// Feld endet auch hier – dann hat es sich nicht bewegt.
function finishDrag(event: OnDragEnd) {
  measureElementAgain()
  if (event.isDrag && selectedElementId.value) saveElement(selectedElementId.value)
}

// Moveable liest die Startgröße aus dem Stil des Elements, rechnet mm dabei aber
// falsch um (Fehler der Library: 96 / 254 statt 96 / 25.4) und startet mit einem
// Zehntel der Größe. Deshalb geben wir sie selbst in px vor.
function setResizeStartSize(event: OnResizeStart) {
  const element = selectedElementId.value && findCardSetElement(selectedElementId.value)
  if (!element) return

  event.set([millimetersToPixels(element.data.width), millimetersToPixels(element.data.height)])
}

// Während des Ziehens gehen Größe und Verschiebung als px direkt aufs Element:
// Moveable misst gleich nach diesem Aufruf nach, Vue zeichnet aber erst später.
// Ändert sich dazwischen die Lage, rechnet Moveable die Größe falsch.
function applyResize(event: OnResize) {
  event.target.style.width = `${event.width}px`
  event.target.style.height = `${event.height}px`
  event.target.style.transform = event.drag.transform
}

// Erst am Ende kommen Größe und Verschiebung in mm ins Element. Vue zeichnet es
// dann neu und ersetzt dabei die px von oben. Ohne letztes Ereignis wurde nur
// geklickt. beforeDist ist die Verschiebung von links/oben seit dem Start.
function finishResize(event: OnResizeEnd) {
  const lastResize: OnResize | undefined = event.lastEvent
  if (!lastResize || !selectedElementId.value) return

  const [moveX, moveY] = lastResize.drag.beforeDist
  resizeElement(
    selectedElementId.value,
    pixelsToMillimeters(lastResize.width),
    pixelsToMillimeters(lastResize.height),
  )
  moveElementBy(selectedElementId.value, pixelsToMillimeters(moveX), pixelsToMillimeters(moveY))
  measureElementAgain()
  saveElement(selectedElementId.value)
}

// Same as the position: the angle goes into the placement, not onto the element.
function applyRotate(event: OnRotate) {
  if (!selectedElementId.value) return

  rotateElementBy(selectedElementId.value, event.delta)
}
</script>

<style>
/* Moveable renders outside this component's markup, so the styles cannot be
   scoped. Its own colour variable paints both the frame and the handles, but it
   writes the blue default onto the same box at run time — so our rule needs the
   two class names to weigh more than its one. */
.moveable-control-box.cb-element-transform {
  --moveable-color: var(--color-gold);
}
</style>
