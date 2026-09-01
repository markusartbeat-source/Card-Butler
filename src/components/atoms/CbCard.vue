<template>
  <!-- One element: it is the card. data-card-id lets the cursor logic find out
       which card the mouse is on. -->
  <div
    class="cb-card-face relative bg-white shadow-lg"
    :class="[isDraggable ? 'cb-card' : '', highlightColor ? 'outline-2 outline-offset-2' : '']"
    :style="{ ...cardFormatStyle(cardFormat), zoom, outlineColor: highlightColor }"
    :data-card-id="id"
  >
    <span class="absolute inset-x-0 top-4 text-center text-3xl font-bold text-background">
      {{ number }}
    </span>
    <!-- Every element type brings its own component from its folder. -->
    <template v-for="element in cardElements" :key="element.id">
      <CbTextElement
        v-if="element.type === 'text'"
        :id="element.id"
        :content="elementValues[element.id]"
        :style="placementStyle(element.placement)"
      />
    </template>
    <!-- On top of the card, e.g. the cursors of other people. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cardElements, type CardElementValues } from '../../cardElements/cardElements'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'
import { placementStyle } from '../../elementTransform/elementPlacement'
import CbTextElement from '../../cardElements/text/CbTextElement.vue'

// The card is always its real size — zoom is the only thing a view decides.
// highlightColor draws a thin frame in the colour of the person standing here.
// The elements come from the deck, elementValues are this card's own contents.
// isDraggable adds the "cb-card" class: it is both the grab cursor and the
// selector the sort library drags by, so the editor's card leaves it out.
withDefaults(
  defineProps<{
    id: string
    number: number
    zoom?: number
    highlightColor?: string
    elementValues?: CardElementValues
    isDraggable?: boolean
  }>(),
  { zoom: gridZoom, elementValues: () => ({}) },
)
</script>
