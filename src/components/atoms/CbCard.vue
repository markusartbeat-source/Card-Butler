<template>
  <!-- One element: it is the card. data-card-id lets the cursor logic find out
       which card the mouse is on. -->
  <div
    class="cb-card-face relative bg-white shadow-lg"
    :class="highlightColor ? 'outline-2 outline-offset-2' : ''"
    :style="{ ...cardFormatStyle(cardFormat), zoom, outlineColor: highlightColor }"
    :data-card-id="id"
  >
    <span
      v-if="side === 'front'"
      class="absolute inset-x-0 top-4 text-center text-3xl font-bold text-background"
    >
      {{ number }}
    </span>
    <!-- Every element type brings its own component from its folder. -->
    <template v-for="element in elementsOnThisSide" :key="element.id">
      <CbTextElement
        v-if="element.type === 'text'"
        :id="element.id"
        :content="elementValues[element.id]"
        :highlight-search="highlightSearch"
        :style="placementStyle(element.placement)"
      />
    </template>
    <!-- On top of the card, e.g. the cursors of other people. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  cardElements,
  type CardElementValues,
  type CardSide,
} from '../../cardElements/cardElements'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'
import { placementStyle } from '../../elementTransform/elementPlacement'
import CbTextElement from '../../cardElements/text/CbTextElement.vue'

// The card is always its real size — zoom is the only thing a view decides.
// highlightColor draws a thin frame in the colour of the person standing here.
// The elements come from the deck, elementValues are this card's own contents.
// highlightSearch marks the search hits in the texts — only the overview wants that.
// side says which face of the card this is — only that side's elements show.
const props = withDefaults(
  defineProps<{
    id: string
    number: number
    zoom?: number
    highlightColor?: string
    elementValues?: CardElementValues
    highlightSearch?: boolean
    side?: CardSide
  }>(),
  { zoom: gridZoom, elementValues: () => ({}), highlightSearch: false, side: 'front' },
)

const elementsOnThisSide = computed(() =>
  cardElements.value.filter((element) => element.side === props.side),
)
</script>
