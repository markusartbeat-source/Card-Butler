<template>
  <!-- While closing, clicks go through to the grid so the next card can be
       picked right away. -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    :class="{ 'pointer-events-none': isClosing }"
  >
    <!-- Own layer, so fading it does not fade the card as well. -->
    <div
      ref="backdrop"
      class="bg-background/80 absolute inset-0 backdrop-blur-md"
      @click="startClosing"
    ></div>

    <!-- Padding matches the settings panel, so the card sits in the middle of
         the space left of it instead of the middle of the screen. -->
    <div class="relative flex flex-col items-center gap-6 pr-88">
      <CbCardToolbar class="transition-opacity" :class="fadeInClasses" />

      <!-- The ring is placed next to the flying wrapper, so it stays put while
           the card moves. -->
      <div class="relative">
        <CbCardOrnament class="transition-opacity" :class="fadeInClasses" />

        <div ref="cardWrapper">
          <CbCard
            :id="id"
            :number="number"
            :element-values="elementValues"
            shape-classes="h-144 w-96 rounded-3xl"
          >
            <!-- The cursors of people standing on exactly this card. -->
            <slot />
          </CbCard>
        </div>
      </div>

      <CbButton
        class="min-w-64 transition-opacity"
        :class="fadeInClasses"
        @click="startClosing"
      >
        {{ dictionary.general.save }}
      </CbButton>
    </div>

    <CbCardSettingsPanel
      class="absolute top-8 right-8 bottom-8 w-80 transition-opacity"
      :class="fadeInClasses"
      :is-visible="areControlsVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import CbButton from '../atoms/CbButton.vue'
import CbCard from '../atoms/CbCard.vue'
import CbCardOrnament from '../atoms/CbCardOrnament.vue'
import CbCardToolbar from '../molecules/CbCardToolbar.vue'
import CbCardSettingsPanel from '../../cardSettings/CbCardSettingsPanel.vue'
import type { CardElementValues } from '../../cardElements/cardElements'

const props = defineProps<{
  id: string
  number: number
  startRect: DOMRect
  elementValues?: CardElementValues
}>()

const emit = defineEmits<{ close: [] }>()

const flightDurationInMilliseconds = 350

const cardWrapper = useTemplateRef<HTMLElement>('cardWrapper')
const backdrop = useTemplateRef<HTMLElement>('backdrop')

// Button, tool bar and settings panel only show up once the card has landed.
const areControlsVisible = ref(false)
// They fade in gently, but disappear at once so they do not disturb the
// card flying back to the grid.
const fadeInClasses = computed(() =>
  areControlsVisible.value
    ? 'opacity-100 duration-300'
    : 'pointer-events-none opacity-0 duration-0',
)

const isClosing = ref(false)

// Keeps the closing flight, so an early unmount can drop its finish handler.
let closingFlight: Animation | null = null

// Fade the darkened, blurred layer in and out along with the card's flight.
function playBackdropFade(direction: 'in' | 'out') {
  const steps = [{ opacity: 0 }, { opacity: 1 }]

  backdrop.value?.animate(direction === 'in' ? steps : [...steps].reverse(), {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Fly the card between its place in the grid and the center of the screen.
function playFlight(direction: 'in' | 'out') {
  const wrapper = cardWrapper.value
  if (!wrapper) return null

  const target = wrapper.getBoundingClientRect()
  const start = props.startRect
  const moveX = start.left + start.width / 2 - (target.left + target.width / 2)
  const moveY = start.top + start.height / 2 - (target.top + target.height / 2)
  const scaleX = start.width / target.width
  const scaleY = start.height / target.height

  const inGrid = { transform: `translate(${moveX}px, ${moveY}px) scale(${scaleX}, ${scaleY})` }
  const inCenter = { transform: 'translate(0px, 0px) scale(1, 1)' }

  return wrapper.animate(direction === 'in' ? [inGrid, inCenter] : [inCenter, inGrid], {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Only tell the page to remove us once the card is back on its grid spot.
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
  // A card picked mid-close replaces us — that close must not fire any more.
  if (closingFlight) closingFlight.onfinish = null
  window.removeEventListener('keydown', closeOnEscape)
})
</script>
