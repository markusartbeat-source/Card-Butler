import { ref, watch } from 'vue'
import { hoveredDropField } from './dropField'

/** True while a card is being dragged. Shared, so the rest of the surface can
    step back for as long as it lasts — including the animation a drop field
    plays after the mouse has already let go. */
export const isDraggingCard = ref(false)

// Where the dragged card started, so the row can be put back the way it was.
let draggedCard: HTMLElement | null = null
let draggedFromIndex = 0

// "oldDraggableIndex" counts cards only, while "oldIndex" also counts the "new
// card" button standing in front of them — that one would be off by one.
export function startCardDrag(event: { item: HTMLElement; oldDraggableIndex?: number }) {
  draggedCard = event.item
  draggedFromIndex = event.oldDraggableIndex ?? 0
  isDraggingCard.value = true
}

/** Tells which drop field the card was let go over — null when it was simply
    sorted back into the row — plus where that card sat and which element it is,
    so a field can still animate with it. The drag state stays up until the
    caller lets go of it with releaseCardDrag. */
export function endCardDrag() {
  return { droppedOn: hoveredDropField.value, cardIndex: draggedFromIndex, cardElement: draggedCard }
}

/** Gives the surface back: the drop bar leaves, everything around the cards
    turns bright again. A finished drag still fires a click on the card, so the
    flag stays alive until that click is over. */
export function releaseCardDrag() {
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
