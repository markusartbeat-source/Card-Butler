<template>
  <!-- Die Anfasser des Bildes beim Zuschneiden, der Rahmen bleibt, wo er ist:
       Ziehen verschiebt, die Ecken zoomen um die Mitte, ohne das
       Seitenverhältnis zu ändern, der Griff dreht. Jede Änderung landet sofort
       im Ausschnitt dieser Karte. Wie bei den Element-Anfassern ist rootContainer
       die Karte, die Werte kommen dann ohne ihren Zoom. -->
  <Moveable
    v-if="pictureNode"
    ref="moveable"
    class-name="cb-element-transform"
    :target="pictureNode"
    :root-container="cardNode"
    :draggable="true"
    :resizable="true"
    :keep-ratio="true"
    :render-directions="['nw', 'ne', 'sw', 'se']"
    :rotatable="true"
    :origin="false"
    @drag="applyDrag"
    @drag-end="measurePictureAgain"
    @resize-start="setResizeStart"
    @resize="applyResize"
    @resize-end="measurePictureAgain"
    @rotate="applyRotate"
    @rotate-end="measurePictureAgain"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, useTemplateRef } from 'vue'
import Moveable, { type OnDrag, type OnResize, type OnResizeStart, type OnRotate } from 'vue3-moveable'
import { measureInMillimeters, millimetersToPixels } from '../../card/millimeters'
import type { Card } from '../../cardSets/cardSets'
import { findCardSetElement } from '../cardElements'
import { coverCrop, pictureCropOf, setPictureCrop, type PictureCrop } from './pictureCrops'

// card ist die offene Karte, cardNode ihr Platz im Editor (wie bei den
// Element-Anfassern), elementId das Bild-Element, das zugeschnitten wird.
const props = defineProps<{ card: Card; cardNode: HTMLElement | null; elementId: string }>()

const moveable = useTemplateRef<InstanceType<typeof Moveable>>('moveable')

// Das ganze Bild, das das Element beim Zuschneiden zeigt – erst einen Tick
// später auf der Karte.
const pictureNode = shallowRef<HTMLImageElement | null>(null)
onMounted(async () => {
  await nextTick()
  pictureNode.value =
    props.cardNode?.querySelector<HTMLImageElement>(
      `[data-element-id="${props.elementId}"] [data-crop-picture]`,
    ) ?? null
})

const imageId = computed(() => props.card.elementImageIds[props.elementId])

// Der Rahmen in px – auf ihn beziehen sich die Anteile des Ausschnitts.
function frameSize() {
  const data = findCardSetElement(props.elementId)?.data
  return { width: millimetersToPixels(data?.width ?? 1), height: millimetersToPixels(data?.height ?? 1) }
}

// Ohne gespeicherten Ausschnitt beginnt es dort, wo das Bild den Rahmen füllt.
function changeCrop(change: (crop: PictureCrop) => Partial<PictureCrop>) {
  const picture = pictureNode.value
  if (!imageId.value || !picture) return
  const frame = frameSize()
  const crop =
    pictureCropOf(props.card.id, props.elementId, imageId.value) ??
    coverCrop(picture.naturalWidth / picture.naturalHeight, frame.width / frame.height)
  setPictureCrop(props.card.id, props.elementId, imageId.value, { ...crop, ...change(crop) })
}

// delta ist die Änderung von left/top, also schon im Rahmen gemessen – auch wenn
// er gedreht ist.
function applyDrag({ delta: [moveX, moveY] }: OnDrag) {
  const frame = frameSize()
  changeCrop((crop) => ({
    centerX: crop.centerX + moveX / frame.width,
    centerY: crop.centerY + moveY / frame.height,
  }))
}

// Die Mitte bleibt (fixedDirection 0, 0), translate(-50 %) im Stil hält sie dort
// auch. Die Startgröße gemessen statt aus dem Stil, siehe Element-Anfasser.
function setResizeStart(event: OnResizeStart) {
  event.setFixedDirection([0, 0])
  const size = measureInMillimeters(event.target as HTMLElement)
  event.set([millimetersToPixels(size.width), millimetersToPixels(size.height)])
}

// Moveable misst gleich nach diesem Aufruf nach, darum die Breite auch direkt
// aufs Bild. Die Höhe folgt dem Bild von selbst.
function applyResize(event: OnResize) {
  event.target.style.width = `${event.width}px`
  changeCrop(() => ({ width: event.width / frameSize().width }))
}

function applyRotate(event: OnRotate) {
  changeCrop((crop) => ({ rotation: crop.rotation + event.delta }))
}

// Das Bild hat sich über den Stil bewegt, nicht über Moveable – ohne neues
// Messen begänne der nächste Griff am alten Platz.
async function measurePictureAgain() {
  await nextTick()
  moveable.value?.updateRect()
}
</script>
