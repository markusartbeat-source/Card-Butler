import type { HorizontalAlignment, VerticalAlignment } from '../../api/elements/elementsApi'
import { findCardSetElement } from '../cardElements'
import { saveElement } from '../saveElement'

// Wie der Text aussieht. Gilt auf allen Karten des Sets.

/** Richtet den Text in seiner Box links, mittig oder rechts aus und speichert.
    Steht er schon so, wird nichts gespeichert. */
export function alignTextHorizontally(id: string, horizontal: HorizontalAlignment) {
  const element = findCardSetElement(id)
  if (!element || element.data.alignment.horizontal === horizontal) return

  element.data.alignment = { ...element.data.alignment, horizontal }
  saveElement(id)
}

/** Wie alignTextHorizontally – nur oben, mittig oder unten. Zu sehen nur bei
    fester Höhe, sonst umschließt die Box den Text. */
export function alignTextVertically(id: string, vertical: VerticalAlignment) {
  const element = findCardSetElement(id)
  if (!element || element.data.alignment.vertical === vertical) return

  element.data.alignment = { ...element.data.alignment, vertical }
  saveElement(id)
}
