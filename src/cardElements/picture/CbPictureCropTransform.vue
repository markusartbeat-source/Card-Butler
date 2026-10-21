<template>
  <!-- Die Anfasser des Bildes beim Zuschneiden, der Rahmen bleibt, wo er ist:
       Ziehen verschiebt, die Ecken zoomen um die Mitte, ohne das
       Seitenverhältnis zu ändern, der Griff dreht. Ohne Maus: Der Rahmen bekommt
       den Fokus, Pfeiltasten verschieben, Plus und Minus zoomen. Das Mausrad über
       der Karte zoomt auch. Jede Änderung landet sofort im Ausschnitt dieser
       Karte. Wie bei den Element-Anfassern ist rootContainer die Karte, die Werte
       kommen dann ohne ihren Zoom. -->
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
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import Moveable, { type OnDrag, type OnResize, type OnResizeStart, type OnRotate } from 'vue3-moveable'
import { measureInMillimeters, millimetersToPixels } from '../../card/millimeters'
import type { Card } from '../../cardSets/cardSets'
import { findCardSetElement } from '../cardElements'
import { coverCrop, pictureCropOf, setPictureCrop, type PictureCrop } from './pictureCrops'

// card ist die offene Karte, cardNode ihr Platz im Editor (wie bei den
// Element-Anfassern), elementId das Bild-Element, das zugeschnitten wird.
const props = defineProps<{ card: Card; cardNode: HTMLElement | null; elementId: string }>()

const moveable = useTemplateRef<InstanceType<typeof Moveable>>('moveable')

// Der Rahmen und das ganze Bild, das er beim Zuschneiden zeigt – erst einen Tick
// später auf der Karte. Der Rahmen bekommt den Fokus, so gehen die Tasten auch
// nach dem Knopf im Panel gleich.
const frameNode = shallowRef<HTMLElement | null>(null)
const pictureNode = shallowRef<HTMLImageElement | null>(null)
onMounted(async () => {
  await nextTick()
  frameNode.value =
    props.cardNode?.querySelector<HTMLElement>(`[data-element-id="${props.elementId}"]`) ?? null
  pictureNode.value = frameNode.value?.querySelector<HTMLImageElement>('[data-crop-picture]') ?? null
  frameNode.value?.addEventListener('keydown', changeCropOnKey)
  frameNode.value?.focus()
  props.cardNode?.addEventListener('wheel', zoomOnWheel, { passive: false })
})

onUnmounted(() => {
  frameNode.value?.removeEventListener('keydown', changeCropOnKey)
  props.cardNode?.removeEventListener('wheel', zoomOnWheel)
})

const imageId = computed(() => props.card.values[props.elementId]?.imageId)

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

// Verschiebt das Bild um px im Rahmen – entlang seiner Kanten, auch wenn er
// gedreht ist.
function movePictureBy(moveX: number, moveY: number) {
  const frame = frameSize()
  changeCrop((crop) => ({
    centerX: crop.centerX + moveX / frame.width,
    centerY: crop.centerY + moveY / frame.height,
  }))
}

// Zoomt um die Mitte des Bildes, factor > 1 vergrößert.
function zoomPictureBy(factor: number) {
  changeCrop((crop) => ({ width: crop.width * factor }))
}

// delta ist die Änderung von left/top, also schon im Rahmen gemessen.
function applyDrag({ delta: [moveX, moveY] }: OnDrag) {
  movePictureBy(moveX, moveY)
}

const directionByArrowKey: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

const zoomFactorByKey: Record<string, number> = { '+': 1.1, '-': 1 / 1.1 }

// Pfeiltasten verschieben um 1 mm, mit Umschalt um 10 mm. Plus und Minus zoomen
// um 10 %. Mit Strg, Alt oder Cmd gehören die Tasten dem Browser (z.B. Seiten-Zoom).
function changeCropOnKey(event: KeyboardEvent) {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  const direction = directionByArrowKey[event.key]
  const zoomFactor = zoomFactorByKey[event.key]
  if (!direction && !zoomFactor) return

  event.preventDefault()
  if (direction) {
    const step = millimetersToPixels(event.shiftKey ? 10 : 1)
    movePictureBy(direction[0] * step, direction[1] * step)
  } else {
    zoomPictureBy(zoomFactor)
  }
  measurePictureAgain()
}

// Ein Schritt einer Maus (deltaY 100) zoomt um etwa 20 %, ein Touchpad mit seinen
// kleinen Schritten stufenlos. Nach oben vergrößert. Die Seite scrollt nicht mit.
function zoomOnWheel(event: WheelEvent) {
  event.preventDefault()
  zoomPictureBy(Math.exp(-event.deltaY / 500))
  measurePictureAgain()
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
