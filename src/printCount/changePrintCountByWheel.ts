import { nextTick } from 'vue'
import type { Card } from '../cardSets/cardSets'
import { changePrintCount } from './changePrintCount'
import { showPrintCountOverlay } from './printCountOverlayState'

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
  changePrintCount(card, card.printCount + step)
}
