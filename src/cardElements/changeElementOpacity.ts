import { findCardSetElement } from './cardElements'
import { saveElement } from './saveElement'

/** Stellt die Deckkraft des Elements ein (0 = unsichtbar, 1 = voll sichtbar) und
    speichert. Ist sie schon so eingestellt, wird nichts gespeichert. */
export function changeElementOpacity(id: string, opacity: number) {
  const element = findCardSetElement(id)
  if (!element || element.data.opacity === opacity) return

  element.data.opacity = opacity
  saveElement(id)
}
