import { cardFormat } from '../card/cardFormat'
import { findCardSetElement, moveElementTo } from './cardElements'
import { saveElement } from './saveElement'
import { visibleSizeOf } from './text/textSizing'

export type HorizontalAlignment = 'left' | 'center' | 'right'
export type VerticalAlignment = 'top' | 'center' | 'bottom'

/** Wie in Figma: schiebt das Element einmalig an den linken bzw. rechten
    Kartenrand oder in die Mitte und speichert. Danach ist es wieder frei
    verschiebbar. Steht es schon dort, wird nichts gespeichert. Eine
    automatische Größe zählt so, wie sie auf der offenen Karte zu sehen ist. */
export function alignElementHorizontally(id: string, alignment: HorizontalAlignment) {
  const element = findCardSetElement(id)
  if (!element) return

  const freeSpace = cardFormat.value.width - visibleSizeOf(element).width
  const x = { left: 0, center: freeSpace / 2, right: freeSpace }[alignment]
  if (x === element.data.position.x) return

  moveElementTo(id, x, element.data.position.y)
  saveElement(id)
}

/** Wie alignElementHorizontally – nur an den oberen bzw. unteren Kartenrand
    oder in die Mitte. */
export function alignElementVertically(id: string, alignment: VerticalAlignment) {
  const element = findCardSetElement(id)
  if (!element) return

  const freeSpace = cardFormat.value.height - visibleSizeOf(element).height
  const y = { top: 0, center: freeSpace / 2, bottom: freeSpace }[alignment]
  if (y === element.data.position.y) return

  moveElementTo(id, element.data.position.x, y)
  saveElement(id)
}
