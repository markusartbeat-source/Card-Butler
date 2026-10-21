import { findCardSetElement, resizeElementSide } from './cardElements'
import { saveElement } from './saveElement'

/** Eine eingetippte Breite oder Höhe in mm für ein Element mit fester Größe.
    Mit keepsAspectRatio ändert sich die andere Seite im gleichen Verhältnis mit.
    Gespeichert wird nur eine geänderte Größe. */
export function changeElementSize(
  id: string,
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  const element = findCardSetElement(id)
  if (!element || element.data[side] === millimeters) return

  resizeElementSide(id, side, millimeters, keepsAspectRatio)
  saveElement(id)
}
