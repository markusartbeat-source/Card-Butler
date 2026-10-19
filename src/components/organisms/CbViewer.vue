<template>
  <CbFocusTrap
    role="dialog"
    aria-modal="true"
    :aria-label="label"
    :return-focus-to="focusedBeforeOpening"
    class="fixed inset-0 z-50"
    :class="{ 'pointer-events-none': isClosing }"
  >
    <!-- Ein Dialog: Etwas fliegt von seiner Kachel in die Mitte, rechts daneben
         seine Einstellungen. Escape oder ein Klick daneben schließt. While
         closing, clicks go through to the grid so the next one can be picked
         right away. -->
    <CbDimLayer ref="backdrop" class="absolute inset-0" @click="startClosing" />

    <!-- Lets clicks beside the content fall through to the dim layer.
         Padding matches the settings panel, so the content sits in the middle
         of the space left of it instead of the middle of the screen. -->
    <div class="pointer-events-none relative flex h-full items-center justify-center p-8 pr-88">
      <!-- The content is as wide as the space allows, never taller than the
           space (4rem is the padding above and below) and small enough to sit
           inside the ring like a card does. -->
      <div
        class="relative w-full"
        :style="{ maxWidth: `min(calc((100vh - 4rem) * ${ratio}), ${widthInsideRing}px)` }"
      >
        <!-- Next to the flying content, so the ring stays put while it moves. -->
        <CbCardOrnament class="transition-opacity" :class="fadeInClasses" />
        <!-- Was fliegt, z.B. ein Bild. Es füllt diese Fläche. -->
        <div ref="content" class="w-full" :style="{ aspectRatio: ratio }">
          <slot />
        </div>
      </div>
    </div>

    <!-- Bekommt beim Öffnen den Fokus, damit ein Screenreader den Dialog
         ansagt und die Tab-Taste von hier durch die Einstellungen geht.
         tabindex -1: nur dafür, nie per Tab-Taste, darum ohne Fokusrahmen. -->
    <div
      data-autofocus
      tabindex="-1"
      class="absolute top-8 right-8 bottom-8 w-80 transition-opacity focus:outline-none"
      :class="fadeInClasses"
    >
      <slot name="panel" />
    </div>
  </CbFocusTrap>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import CbCardOrnament from '../atoms/CbCardOrnament.vue'
import CbDimLayer from '../atoms/CbDimLayer.vue'
import CbFocusTrap from '../atoms/CbFocusTrap.vue'

const props = defineProps<{
  /** Vorlesename des Dialogs, z.B. der Bildname. */
  label: string
  /** Seitenverhältnis (Breite / Höhe) des Inhalts wie auf der Kachel. */
  ratio: number
  /* Where the clicked tile sits — the flight starts and ends there. */
  startRect: DOMRect
}>()
const emit = defineEmits<{ close: [] }>()

// Die Kachel ist gleich unsichtbar und verliert dabei den Fokus. Darum hier
// gemerkt, solange er noch auf ihr steht – nach dem Schließen kehrt er zurück.
const focusedBeforeOpening = document.activeElement instanceof HTMLElement ? document.activeElement : null

const flightDurationInMilliseconds = 350

// The ring is drawn for the editor's card (381 × 532 px, a diagonal of about
// 650 px). Content with the same diagonal fills the ring the same way, so
// its width follows from the diagonal and its aspect ratio.
const diagonalInsideRing = 650
const widthInsideRing = Math.round((diagonalInsideRing * props.ratio) / Math.hypot(props.ratio, 1))

const content = useTemplateRef<HTMLElement>('content')
const backdrop = useTemplateRef<InstanceType<typeof CbDimLayer>>('backdrop')

// Ring and settings panel only show up once the content has landed.
const areControlsVisible = ref(false)
// They fade in gently, but disappear at once so they do not disturb the
// content flying back to its tile.
const fadeInClasses = computed(() =>
  areControlsVisible.value
    ? 'opacity-100 duration-300'
    : 'pointer-events-none opacity-0 duration-0',
)

const isClosing = ref(false)

// Keeps the closing flight, so an early unmount can drop its finish handler.
let closingFlight: Animation | null = null

// Fade the darkened, blurred layer in and out along with the content's flight.
function playBackdropFade(direction: 'in' | 'out') {
  const steps = [{ opacity: 0 }, { opacity: 1 }]

  backdrop.value?.$el.animate(direction === 'in' ? steps : [...steps].reverse(), {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Fly the content between its tile and the center of the screen.
function playFlight(direction: 'in' | 'out') {
  const element = content.value
  if (!element) return null

  const target = element.getBoundingClientRect()
  const start = props.startRect
  const moveX = start.left + start.width / 2 - (target.left + target.width / 2)
  const moveY = start.top + start.height / 2 - (target.top + target.height / 2)
  const scaleX = start.width / target.width
  const scaleY = start.height / target.height

  const onTile = { transform: `translate(${moveX}px, ${moveY}px) scale(${scaleX}, ${scaleY})` }
  const inCenter = { transform: 'translate(0px, 0px) scale(1, 1)' }

  return element.animate(direction === 'in' ? [onTile, inCenter] : [inCenter, onTile], {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Only tell the page to remove us once the content is back on its tile.
function startClosing() {
  if (isClosing.value) return
  isClosing.value = true
  areControlsVisible.value = false

  playBackdropFade('out')

  closingFlight = playFlight('out')
  if (!closingFlight) return emit('close')
  closingFlight.onfinish = () => emit('close')
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') startClosing()
}

onMounted(() => {
  playBackdropFade('in')

  const animation = playFlight('in')
  if (animation) animation.onfinish = () => (areControlsVisible.value = true)
  else areControlsVisible.value = true

  window.addEventListener('keydown', closeOnEscape)
})

onUnmounted(() => {
  // Content picked mid-close replaces us — that close must not fire any more.
  if (closingFlight) closingFlight.onfinish = null
  window.removeEventListener('keydown', closeOnEscape)
})
</script>
