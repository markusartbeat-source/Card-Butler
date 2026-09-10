<template>
  <!-- The bar drops in over the dimmed header, so it is fixed to the top of the
       window and as tall as the header. That puts it at the height of the
       search field. -->
  <Transition name="drop-bar">
    <div
      v-if="isDraggingCard"
      class="pointer-events-none fixed inset-x-0 top-0 z-10 flex h-25 items-center justify-center"
    >
      <CbToolbar :elements="dropFields" show-names />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbToolbar from '../components/molecules/CbToolbar.vue'
import { isDraggingCard } from './cardDragState'
import type { ToolbarElement } from '../components/molecules/toolbarElement'

// What a card can be dropped on, in bar order.
const dropFields = computed<ToolbarElement[]>(() => [
  { name: dictionary.cardDrag.deleteCard, icon: 'delete' },
  { name: dictionary.cardDrag.flipAllCards, icon: 'rotate_360' },
])
</script>

<style scoped>
.drop-bar-enter-active,
.drop-bar-leave-active {
  transition: translate 350ms ease;
}

.drop-bar-enter-from,
.drop-bar-leave-to {
  translate: 0 -100%;
}
</style>
