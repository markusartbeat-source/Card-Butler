import { computed } from 'vue'
import { isDraggingCard } from './cardDragState'

/** Everything that steps back while a card is dragged wears these classes.
    Pure CSS — only the class is bound, nothing is animated by hand. */
export const dimWhileDraggingClasses = computed(() => [
  'transition-opacity duration-300',
  isDraggingCard.value ? 'opacity-20' : '',
])
