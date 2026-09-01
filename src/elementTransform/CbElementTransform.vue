<template>
  <!-- The library takes its props as a plain name list, so Vue does not turn a
       bare "draggable" into true — every switch needs an explicit value. -->
  <Moveable
    v-if="targetElement"
    class-name="cb-element-transform"
    :target="targetElement"
    :draggable="true"
    :resizable="true"
    :rotatable="true"
    :origin="false"
    @drag="applyDrag"
    @resize="applyResize"
    @rotate="applyRotate"
  />
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import Moveable, { type OnDrag, type OnResize, type OnRotate } from 'vue3-moveable'
import { selectedElementId } from './elementSelection'

// The card the selected element lives in. Searching inside it instead of the
// whole page keeps us away from the same element on the other cards.
const props = defineProps<{ card: HTMLElement | null }>()

const targetElement = ref<HTMLElement | null>(null)

// Wait a tick, so the element is really in the page before we look for it.
watch(
  [selectedElementId, () => props.card],
  async ([id, card]) => {
    await nextTick()
    targetElement.value =
      id && card ? card.querySelector<HTMLElement>(`[data-element-id="${id}"]`) : null
  },
  { immediate: true },
)

// Moveable never changes the element itself — it hands us the new values and we
// write them onto the element.
function applyDrag(event: OnDrag) {
  event.target.style.transform = event.transform
}

function applyResize(event: OnResize) {
  event.target.style.width = `${event.width}px`
  event.target.style.height = `${event.height}px`
  event.target.style.transform = event.drag.transform
}

function applyRotate(event: OnRotate) {
  event.target.style.transform = event.drag.transform
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
