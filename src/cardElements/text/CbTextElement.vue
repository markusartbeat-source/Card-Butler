<template>
  <!-- data-element-id lets the transform handles find this element on the card.
       The card hands in the position, so no "relative" or "inline-block" here. -->
  <span
    v-ripple
    class="cb-hover text-background overflow-hidden rounded px-1"
    :data-element-id="id"
    @click="selectElement(id)"
  >
    <span
      v-for="(part, index) in textParts"
      :key="index"
      :class="part.isMatch ? 'bg-gold-light rounded' : ''"
      >{{ part.text }}</span
    >
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { selectElement } from '../../elementTransform/elementSelection'
import { splitBySearchWord } from '../../search/splitBySearchWord'

// The content is the one thing each card fills in itself. Only the card
// overview asks for the found spots to be marked.
const props = withDefaults(
  defineProps<{ id: string; content?: string; highlightSearch?: boolean }>(),
  { content: '', highlightSearch: false },
)

const textParts = computed(() =>
  props.highlightSearch
    ? splitBySearchWord(props.content)
    : [{ text: props.content, isMatch: false }],
)
</script>
