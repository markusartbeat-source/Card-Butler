import { flyInto } from '../animation/flyInto'

// Wo die gezogene Kopie zuletzt hing. Die Zieh-Bibliothek nimmt sie weg, bevor
// sie das Ablegen meldet – mehr bekommt ein Flug danach nie zu sehen.
let lastDraggedRect: DOMRect | null = null

export function rememberDraggedRect(rect: DOMRect) {
  lastDraggedRect = rect
}

/** Zeichnet eine Kopie des Gezogenen dort, wo es zuletzt hing, und lässt sie in
    die Mitte eines Ziels fliegen, z.B. eines Felds der Drop-Leiste oder eines
    Ordners. Die Kopie trägt eine eigene Klasse, nicht die der gezogenen Kopie –
    nach der sucht die Leiste noch bei jeder Mausbewegung. Die Größe kommt mit,
    weil eine Bildkachel ihre Breite sonst nur aus ihrer Reihe hat. */
export async function flyDraggedCopy(element: HTMLElement, into: DOMRect, durationInMilliseconds: number) {
  const from = lastDraggedRect
  if (!from) return

  const flyingCopy = element.cloneNode(true) as HTMLElement
  flyingCopy.classList.remove('cb-drag-ghost', 'animate-cb-rise')
  flyingCopy.classList.add('cb-flying-copy')
  flyingCopy.style.left = `${from.left}px`
  flyingCopy.style.top = `${from.top}px`
  flyingCopy.style.width = `${from.width}px`
  flyingCopy.style.height = `${from.height}px`
  document.body.append(flyingCopy)

  await flyInto(flyingCopy, into, durationInMilliseconds)
  flyingCopy.remove()
}
