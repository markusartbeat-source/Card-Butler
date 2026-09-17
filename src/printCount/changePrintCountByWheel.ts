import type { Card } from '../cardSets/cardSets'

// A card is printed at least once, and never more than 99 times.
export const minPrintCount = 1
export const maxPrintCount = 99

// Alt + mouse wheel over a card: wheel up adds a copy, wheel down takes one
// away. The page must not scroll along, so the event is swallowed. Without Alt
// the wheel is left alone and scrolls the page as usual.
export function changePrintCountByWheel(card: Card, event: WheelEvent) {
  if (!event.altKey) return
  event.preventDefault()

  const step = event.deltaY < 0 ? 1 : -1
  card.printCount = Math.min(maxPrintCount, Math.max(minPrintCount, card.printCount + step))
}
