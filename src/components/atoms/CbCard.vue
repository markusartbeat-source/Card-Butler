<template>
  <!-- data-card-id lets the cursor logic find out which card the mouse is on. -->
  <div
    class="cb-card relative"
    :class="[shapeClasses, highlightColor ? 'outline-2 outline-offset-2' : '']"
    :style="highlightColor ? { outlineColor: highlightColor } : undefined"
    :data-card-id="id"
  >
    <!-- The inner face carries the look, so dragging can transform it while
         the sort library controls the transform of the outer element. -->
    <div
      class="cb-card-face flex h-full w-full flex-col items-center justify-center bg-white shadow-lg"
    >
      <span class="text-5xl font-bold text-background">{{ number }}</span>
      <!-- Every element type brings its own component from its folder. -->
      <template v-for="element in cardElements" :key="element.id">
        <CbTextElement v-if="element.type === 'text'" :content="elementValues[element.id]" />
      </template>
    </div>
    <!-- Overlay on top of the card face, e.g. the cursors of other people. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cardElements, type CardElementValues } from '../../cardElements/cardElements'
import CbTextElement from '../../cardElements/text/CbTextElement.vue'

// Each card decides its own size and shape via shapeClasses.
// highlightColor draws a thin frame in the colour of the person standing here.
// The elements come from the deck, elementValues are this card's own contents.
withDefaults(
  defineProps<{
    id: string
    number: number
    shapeClasses?: string
    highlightColor?: string
    elementValues?: CardElementValues
  }>(),
  { shapeClasses: 'h-72 w-48 rounded-2xl', elementValues: () => ({}) },
)
</script>
