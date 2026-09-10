<template>
  <!-- The bar drops in over the dimmed header, so it is fixed to the top of the
       window and as tall as the header. That puts it at the height of the
       search field. -->
  <Transition name="drop-bar">
    <div
      v-if="isDraggingCard"
      class="pointer-events-none fixed inset-x-0 top-0 z-10 flex h-25 items-center justify-center"
    >
      <CbToolbar
        ref="toolbar"
        :elements="fieldElements"
        :active-index="hoveredFieldIndex"
        show-names
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import CbToolbar from '../components/molecules/CbToolbar.vue'
import { isDraggingCard } from './cardDragState'
import { dropFields, hoveredDropField } from './dropField'
import type { ToolbarElement } from '../components/molecules/toolbarElement'

// How the fields of the bar are shown, in the same order as "dropFields".
const fieldElements = computed<ToolbarElement[]>(() => [
  { name: dictionary.cardDrag.deleteCard, icon: 'delete' },
  { name: dictionary.cardDrag.flipAllCards, icon: 'rotate_360' },
])

const toolbar = useTemplateRef<InstanceType<typeof CbToolbar>>('toolbar')

const hoveredFieldIndex = computed(() =>
  hoveredDropField.value === null ? null : dropFields.indexOf(hoveredDropField.value),
)

// The bar lets the mouse through, so nothing up there can react on its own. The
// dragged card is measured instead — that is the copy the drag library moves
// around. A card is wider than a field, so the field it covers most wins.
function updateDropTarget() {
  if (!isDraggingCard.value) return
  const cardRect = document.querySelector('.cb-card-dragged')?.getBoundingClientRect()
  const index = cardRect ? toolbar.value?.indexOverlapping(cardRect) : null
  hoveredDropField.value = index === null || index === undefined ? null : dropFields[index]
}

onMounted(() => window.addEventListener('mousemove', updateDropTarget))
onUnmounted(() => window.removeEventListener('mousemove', updateDropTarget))
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
