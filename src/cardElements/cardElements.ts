import type { ElementData } from '../api/elements/elementsApi'
import { sizeWithChangedSide } from '../card/sizeWithChangedSide'
import { cardSets, findCardSetOfElement } from '../cardSets/cardSets'
import { saveElement } from './saveElement'
import { visibleSizeOf } from './text/textSizing'

// Alle Karten eines Sets sind gleich aufgebaut: Die Elemente gehören zum Set,
// nicht zur einzelnen Karte. Nur ein Wert je Element unterscheidet sich von
// Karte zu Karte (cardValues.ts). Jeder Elementtyp hat seinen Ordner neben
// dieser Datei.

// Mehr lässt das Backend nicht zu.
export const maxElementNameLength = 200

export type HorizontalAlignment = 'left' | 'center' | 'right'
export type VerticalAlignment = 'top' | 'center' | 'bottom'

// Sucht ein Element in allen Sets – die ids sind überall eindeutig.
export function findCardSetElement(id: string) {
  return cardSets.value?.flatMap((cardSet) => cardSet.elements).find((element) => element.id === id)
}

// Ohne Speichern – für Zwischenschritte, z.B. beim Ziehen. Gespeichert wird am
// Ende einmal mit saveElement.

// Dragging an element moves it on every card of the deck — the build-up belongs
// to the deck, only the contents differ from card to card.
export function moveElementBy(id: string, moveXInMillimeters: number, moveYInMillimeters: number) {
  const element = findCardSetElement(id)
  if (!element) return

  const { position } = element.data
  element.data.position = {
    ...position,
    x: position.x + moveXInMillimeters,
    y: position.y + moveYInMillimeters,
  }
}

export function resizeElement(id: string, widthInMillimeters: number, heightInMillimeters: number) {
  const element = findCardSetElement(id)
  if (!element) return

  element.data.width = widthInMillimeters
  element.data.height = heightInMillimeters
}

// Eine neue Breite oder Höhe in mm. Mit keepsAspectRatio ändert sich die andere
// Seite im gleichen Verhältnis mit.
export function resizeElementSide(
  id: string,
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  const element = findCardSetElement(id)
  if (!element) return

  const size = sizeWithChangedSide(element.data, side, millimeters, keepsAspectRatio)
  resizeElement(id, size.width, size.height)
}

export function rotateElementBy(id: string, turnInDegrees: number) {
  const element = findCardSetElement(id)
  if (element) element.rotation += turnInDegrees
}

/** Zeigt die Farbe (Text- bzw. Füllfarbe) sofort auf allen Karten – z.B. beim
    Ziehen im Farbwähler. changeElementColor speichert danach einmal. */
export function previewElementColor(id: string, color: string) {
  const element = findCardSetElement(id)
  if (element) element.data.color = color
}

// Mit Speichern – eine Aktion im Panel.

/** Ändert die Daten eines Elements und speichert sie. */
export function changeElement(id: string, change: (data: ElementData) => void) {
  const element = findCardSetElement(id)
  if (!element) return

  change(element.data)
  saveElement(id)
}

/** Ein leerer Name ist nicht erlaubt – dann bleibt der alte. Liefert den Namen,
 *  den das Element jetzt trägt. */
export function renameElement(id: string, name: string) {
  const trimmedName = name.trim()
  if (trimmedName) changeElement(id, (data) => (data.name = trimmedName))
  return findCardSetElement(id)?.data.name ?? name
}

/** Setzt die linke obere Ecke des Elements auf diesen Punkt der Karte (mm). */
export function changeElementPosition(id: string, xInMillimeters: number, yInMillimeters: number) {
  changeElement(id, (data) => {
    data.position = { ...data.position, x: xInMillimeters, y: yInMillimeters }
  })
}

/** Wie in Figma: schiebt das Element einmalig an den linken bzw. rechten
    Kartenrand oder in die Mitte. Danach ist es wieder frei verschiebbar. Eine
    automatische Größe zählt so, wie sie auf der offenen Karte zu sehen ist. */
export function alignElementHorizontally(id: string, alignment: HorizontalAlignment) {
  const element = findCardSetElement(id)
  const cardSet = findCardSetOfElement(id)
  if (!element || !cardSet) return

  const freeSpace = cardSet.data.width - visibleSizeOf(element).width
  const x = { left: 0, center: freeSpace / 2, right: freeSpace }[alignment]
  changeElementPosition(id, x, element.data.position.y)
}

/** Wie alignElementHorizontally – nur an den oberen bzw. unteren Kartenrand
    oder in die Mitte. */
export function alignElementVertically(id: string, alignment: VerticalAlignment) {
  const element = findCardSetElement(id)
  const cardSet = findCardSetOfElement(id)
  if (!element || !cardSet) return

  const freeSpace = cardSet.data.height - visibleSizeOf(element).height
  const y = { top: 0, center: freeSpace / 2, bottom: freeSpace }[alignment]
  changeElementPosition(id, element.data.position.x, y)
}

/** Eine eingetippte Breite oder Höhe in mm für ein Element mit fester Größe.
    Mit keepsAspectRatio ändert sich die andere Seite im gleichen Verhältnis mit. */
export function changeElementSize(
  id: string,
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  resizeElementSide(id, side, millimeters, keepsAspectRatio)
  saveElement(id)
}

/** Die Deckkraft des Elements: 0 = unsichtbar, 1 = voll sichtbar. */
export function changeElementOpacity(id: string, opacity: number) {
  changeElement(id, (data) => (data.opacity = opacity))
}

/** Die Farbe des Elements: beim Text die Schrift, bei Formen die Füllung. */
export function changeElementColor(id: string, color: string) {
  changeElement(id, (data) => (data.color = color))
}
