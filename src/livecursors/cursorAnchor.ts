// A cursor position is never stored in screen pixels: the cards wrap
// differently on every screen. It is stored as "which card, and where on that
// card in percent" — that means the same thing for everybody.
export type CursorAnchor = { cardId: string; x: number; y: number }

// Finds the card under the mouse and the position on it in percent.
// Returns null when the mouse is not over a card.
export function readAnchorFromMouse(event: MouseEvent): CursorAnchor | null {
  const target = event.target as HTMLElement | null
  const card = target?.closest('[data-card-id]') as HTMLElement | null
  if (!card) return null

  const rect = card.getBoundingClientRect()
  return {
    cardId: card.dataset.cardId as string,
    x: toPercent(event.clientX - rect.left, rect.width),
    y: toPercent(event.clientY - rect.top, rect.height),
  }
}

function toPercent(distance: number, size: number) {
  return Math.round((distance / size) * 1000) / 10
}
