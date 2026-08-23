<template>
  <!-- Full screen layer that darkens and blurs the page behind it. -->
  <div
    ref="backdrop"
    class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
    @click.self="startClosing"
  >
    <div ref="cardWrapper">
      <CbCard :number="number" shape-classes="h-144 w-96 rounded-3xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import CbCard from '../atoms/CbCard.vue'

const props = defineProps<{ number: number; startRect: DOMRect }>()

const emit = defineEmits<{ close: [] }>()

const flightDurationInMilliseconds = 350

const cardWrapper = useTemplateRef<HTMLElement>('cardWrapper')
const backdrop = useTemplateRef<HTMLElement>('backdrop')

let isClosing = false

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
  if (isClosing) return
  isClosing = true

  playBackdropFade('out')

  const animation = playFlight('out')
  if (!animation) return emit('close')
  animation.onfinish = () => emit('close')
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') startClosing()
}

onMounted(() => {
  playBackdropFade('in')
  playFlight('in')
  window.addEventListener('keydown', closeOnEscape)
})

onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>
