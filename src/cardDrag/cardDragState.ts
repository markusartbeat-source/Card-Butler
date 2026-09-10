import { ref, watch } from 'vue'
import { hoveredDropField } from './dropField'

/** True while a card is being dragged. Shared, so the rest of the surface can
    step back for as long as it lasts. */
export const isDraggingCard = ref(false)

// Where the dragged card started, so the row can be put back the way it was.
let draggedCard: HTMLElement | null = null
let draggedFromIndex = 0

export function startCardDrag(event: { item: HTMLElement; oldIndex?: number }) {
  draggedCard = event.item
  draggedFromIndex = event.oldIndex ?? 0
  isDraggingCard.value = true
}

// A finished drag still fires a click on the card, so the flag stays alive
// until that click is over.
export function endCardDrag() {
  hoveredDropField.value = null
  draggedCard = null
  setTimeout(() => {
    isDraggingCard.value = false
  }, 0)
}

// Up at the drop bar the card belongs nowhere in the row any more. The row
// keeps showing the last spot the card passed on its way up, so the empty slot
// is moved back to where the card came from — and dropping on a field then
// leaves the order alone.
watch(hoveredDropField, (field) => {
  const row = draggedCard?.parentElement
  if (field === null || !draggedCard || !row) return
  const otherCards = [...row.querySelectorAll('.cb-card')].filter((card) => card !== draggedCard)
  row.insertBefore(draggedCard, otherCards[draggedFromIndex] ?? null)
})
