<template>
  <!-- While closing, clicks go through to the grid so the next picture can be
       picked right away. -->
  <div class="fixed inset-0 z-50" :class="{ 'pointer-events-none': isClosing }">
    <CbDimLayer ref="backdrop" class="absolute inset-0" @click="startClosing" />

    <!-- Lets clicks beside the picture fall through to the dim layer.
         Padding matches the settings panel, so the picture sits in the middle
         of the space left of it instead of the middle of the screen. -->
    <div class="pointer-events-none relative flex h-full items-center justify-center p-8 pr-88">
      <!-- The picture is as wide as the space allows, never taller than the
           space (4rem is the padding above and below) and small enough to sit
           inside the ring like a card does. -->
      <div
        class="relative w-full"
        :style="{ maxWidth: `min(calc((100vh - 4rem) * ${ratio}), ${widthInsideRing}px)` }"
      >
        <!-- Next to the flying picture, so the ring stays put while it moves. -->
        <CbCardOrnament class="transition-opacity" :class="fadeInClasses" />
        <div
          ref="picture"
          class="w-full rounded-lg bg-gradient-to-br"
          :class="image.gradientClasses"
          :style="{ aspectRatio: ratio }"
        />
      </div>
    </div>

    <CbImageSettingsPanel
      class="absolute top-8 right-8 bottom-8 w-80 transition-opacity"
      :class="fadeInClasses"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import CbCardOrnament from '../components/atoms/CbCardOrnament.vue'
import CbDimLayer from '../components/atoms/CbDimLayer.vue'
import CbImageSettingsPanel from './CbImageSettingsPanel.vue'
import type { DummyImage } from './dummyImages'

const props = defineProps<{
  image: DummyImage
  /* Where the clicked tile sits in the grid — the flight starts and ends there. */
  startRect: DOMRect
}>()
const emit = defineEmits<{ close: [] }>()

const flightDurationInMilliseconds = 350

const ratio = props.image.ratioWidth / props.image.ratioHeight

// The ring is drawn for the editor's card (381 × 532 px, a diagonal of about
// 650 px). A picture with the same diagonal fills the ring the same way, so
// its width follows from the diagonal and its aspect ratio.
const diagonalInsideRing = 650
const widthInsideRing = Math.round((diagonalInsideRing * ratio) / Math.hypot(ratio, 1))

const picture = useTemplateRef<HTMLElement>('picture')
const backdrop = useTemplateRef<InstanceType<typeof CbDimLayer>>('backdrop')

// Ring and settings panel only show up once the picture has landed.
const areControlsVisible = ref(false)
// They fade in gently, but disappear at once so they do not disturb the
// picture flying back to the grid.
const fadeInClasses = computed(() =>
  areControlsVisible.value
    ? 'opacity-100 duration-300'
    : 'pointer-events-none opacity-0 duration-0',
)

const isClosing = ref(false)

// Keeps the closing flight, so an early unmount can drop its finish handler.
let closingFlight: Animation | null = null

// Fade the darkened, blurred layer in and out along with the picture's flight.
function playBackdropFade(direction: 'in' | 'out') {
  const steps = [{ opacity: 0 }, { opacity: 1 }]

  backdrop.value?.$el.animate(direction === 'in' ? steps : [...steps].reverse(), {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Fly the picture between its tile in the grid and the center of the screen.
function playFlight(direction: 'in' | 'out') {
  const element = picture.value
  if (!element) return null

  const target = element.getBoundingClientRect()
  const start = props.startRect
  const moveX = start.left + start.width / 2 - (target.left + target.width / 2)
  const moveY = start.top + start.height / 2 - (target.top + target.height / 2)
  const scaleX = start.width / target.width
  const scaleY = start.height / target.height

  const inGrid = { transform: `translate(${moveX}px, ${moveY}px) scale(${scaleX}, ${scaleY})` }
  const inCenter = { transform: 'translate(0px, 0px) scale(1, 1)' }

  return element.animate(direction === 'in' ? [inGrid, inCenter] : [inCenter, inGrid], {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Only tell the page to remove us once the picture is back on its tile.
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
  // A picture picked mid-close replaces us — that close must not fire any more.
  if (closingFlight) closingFlight.onfinish = null
  window.removeEventListener('keydown', closeOnEscape)
})
</script>
