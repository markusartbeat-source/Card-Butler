import { ref } from 'vue'

/** True while a card is being dragged. Shared, so the rest of the surface can
    step back for as long as it lasts. */
export const isDraggingCard = ref(false)

export function startCardDrag() {
  isDraggingCard.value = true
}

// A finished drag still fires a click on the card, so the flag stays alive
// until that click is over.
export function endCardDrag() {
  setTimeout(() => {
    isDraggingCard.value = false
  }, 0)
}
