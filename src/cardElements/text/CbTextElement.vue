<template>
  <!-- data-element-id lets the transform handles find this element on the card.
       The card hands in the position, so no "relative" or "inline-block" here. -->
  <span
    v-ripple
    class="cb-hover text-background overflow-hidden rounded px-1"
    :data-element-id="id"
    @click="selectElement(id)"
  >
    {{ content }}
  </span>
</template>

<script setup lang="ts">
import { selectElement } from '../../elementTransform/elementSelection'

// The content is the one thing each card fills in itself.
defineProps<{ id: string; content?: string }>()
</script>
