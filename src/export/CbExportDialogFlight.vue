<template>
  <!-- The export dialog is gone the moment the export starts. This empty box
       stands exactly where it was, shrinks to toast size and flies into the
       toast corner, where the real toast takes over. The dark backdrop of the
       dialog fades away while it flies. -->
  <Teleport to="body">
    <div ref="backdropElement" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-md" />

    <div
      ref="boxElement"
      class="fixed z-50 bg-gradient-to-b from-surface to-transparent p-px shadow-lg"
      :style="startStyle"
    >
      <!-- The dark surface of the dialog. Its corners follow the box, which
           rounds itself down from dialog to toast on the way. -->
      <div class="h-full w-full bg-background" style="border-radius: inherit" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'

const props = defineProps<{ startRect: DOMRect }>()
const emit = defineEmits<{ arrived: [] }>()

const backdropElement = useTemplateRef<HTMLElement>('backdropElement')
const boxElement = useTemplateRef<HTMLElement>('boxElement')

// The same 350 ms every other dialog animation takes.
const flightDuration = 350

// Where the toast is going to sit: the toaster keeps its default 1rem from the
// corner of the window, the toast is w-84 wide, and the progress toast is 76 px
// tall — the height of its frame in the Figma design.
const toastOffset = 16
const toastWidth = 336
const toastHeight = 76

// rounded-3xl on the dialog, rounded-lg on the toast.
const dialogCornerRadius = 24
const toastCornerRadius = 8

// Where the flight begins: the place the dialog had a moment ago.
const startStyle = {
  left: `${props.startRect.left}px`,
  top: `${props.startRect.top}px`,
  width: `${props.startRect.width}px`,
  height: `${props.startRect.height}px`,
  borderRadius: `${dialogCornerRadius}px`,
}

let flight: Animation | undefined

onMounted(() => {
  const box = boxElement.value
  if (!box) {
    emit('arrived')
    return
  }

  backdropElement.value?.animate(
    { opacity: [1, 0] },
    { duration: flightDuration, easing: 'ease-in', fill: 'forwards' },
  )

  flight = box.animate(
    {
      left: [startStyle.left, `${window.innerWidth - toastOffset - toastWidth}px`],
      top: [startStyle.top, `${window.innerHeight - toastOffset - toastHeight}px`],
      width: [startStyle.width, `${toastWidth}px`],
      height: [startStyle.height, `${toastHeight}px`],
      borderRadius: [startStyle.borderRadius, `${toastCornerRadius}px`],
    },
    { duration: flightDuration, easing: 'ease-in-out', fill: 'forwards' },
  )
  flight.onfinish = () => emit('arrived')
})

// A flight that is taken off the page has nothing left to announce.
onUnmounted(() => {
  if (flight) flight.onfinish = null
})
</script>
