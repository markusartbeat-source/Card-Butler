import type { ElementPlacement } from '../elementTransform/elementPlacement'
import { cardSets, type Card, type CardSetElement } from '../cardSets/cardSets'
import type { PictureElement } from './picture/pictureElement'
import { textAppearanceOf } from './text/textAppearance'
import type { TextElement } from './text/textElement'
import { textSizingOf } from './text/textSizing'

// Alle Karten eines Sets sind gleich aufgebaut: Die Elemente gehören zum Set,
// nicht zur einzelnen Karte. Nur ein Wert je Element unterscheidet sich von
// Karte zu Karte – der Inhalt eines Texts, der Link eines Bilds.
// Each element type has its own folder next to this file.

// The back of a card is built the same way as the front — each element says
// which side it sits on. Ids are unique across both sides.
export type CardSide = 'front' | 'back'

// What every element type has, no matter what it shows. Breite und Höhe in mm,
// ohne sie wächst das Element mit seinem Inhalt.
export type CardElementBase = {
  id: string
  name: string
  side: CardSide
  placement: ElementPlacement
  width: number | null
  height: number | null
  opacity: number
}

export type CardElement = TextElement | PictureElement

/** Macht aus einem Element des Sets eins zum Zeichnen. Das Backend kennt keine
    Kartenseiten – alles liegt vorn. Gezeichnet werden bisher nur Textfelder und
    Bilder mit x/y-Position; andere (z.B. von anderen Programmen angelegt) fehlen
    noch. */
export function cardElementFromCardSetElement(element: CardSetElement): CardElement | null {
  const { id, data, rotation } = element
  const { x, y } = data.position
  if (x == null || y == null) return null

  const base = {
    id,
    name: data.name,
    side: 'front' as const,
    placement: { x, y, rotation },
    opacity: data.opacity,
  }
  if (data.type === 'PICTURE') {
    return { ...base, type: 'picture', width: data.width, height: data.height }
  }
  if (data.type !== 'TEXT') return null

  const sizing = textSizingOf(element)
  return {
    ...base,
    type: 'text',
    width: sizing === 'autoWidth' ? null : data.width,
    height: sizing === 'fixed' ? data.height : null,
    horizontalAlignment: data.alignment.horizontal,
    verticalAlignment: data.alignment.vertical,
    ...textAppearanceOf(data),
  }
}

// Sucht ein Element in allen Sets – die ids sind überall eindeutig.
export function findCardSetElement(id: string) {
  return cardSets.value?.flatMap((cardSet) => cardSet.elements).find((element) => element.id === id)
}

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

// Setzt die linke obere Ecke des Elements auf diesen Punkt der Karte (mm).
export function moveElementTo(id: string, xInMillimeters: number, yInMillimeters: number) {
  const element = findCardSetElement(id)
  if (!element) return

  element.data.position = { ...element.data.position, x: xInMillimeters, y: yInMillimeters }
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

  const { width, height } = element.data
  const factor = keepsAspectRatio ? millimeters / element.data[side] : 1
  const size = { width: width * factor, height: height * factor, [side]: millimeters }
  resizeElement(id, size.width, size.height)
}

export function rotateElementBy(id: string, turnInDegrees: number) {
  const element = findCardSetElement(id)
  if (element) element.rotation += turnInDegrees
}

// What one card fills into the deck's elements, keyed by element id.
export type CardElementValues = Record<string, string>

// Der Inhalt eines Elements gilt nur für diese eine Karte.
export function setElementValue(card: Card, elementId: string, value: string) {
  card.elementValues[elementId] = value
}
