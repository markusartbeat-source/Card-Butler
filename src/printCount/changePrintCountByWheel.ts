import { nextTick } from 'vue'
import type { Card } from '../cardSets/cardSets'
import { showPrintCountOverlay } from './printCountOverlayState'

// A card is printed at least once, and never more than 99 times.
export const minPrintCount = 1
export const maxPrintCount = 99

// Alt + mouse wheel over a card: wheel up adds a copy, wheel down takes one
// away. The page must not scroll along, so the event is swallowed. Without Alt
// the wheel is left alone and scrolls the page as usual.
export async function changePrintCountByWheel(card: Card, event: WheelEvent) {
  if (!event.altKey) return
  event.preventDefault()

  // The overlay opens with the old number on it, so the change is only made
  // once the overlay is on the page — then the number slides to the new one.
  showPrintCountOverlay(card.id)
  await nextTick()

  const step = event.deltaY < 0 ? 1 : -1
  card.printCount = Math.min(maxPrintCount, Math.max(minPrintCount, card.printCount + step))
}
