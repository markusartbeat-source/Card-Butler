import type { ElementPlacement } from '../elementTransform/elementPlacement'
import { cardSets, type CardSetElement } from '../cardSets/cardSets'
import type { TextElement } from './text/textElement'

// Alle Karten eines Sets sind gleich aufgebaut: Die Elemente gehören zum Set,
// nicht zur einzelnen Karte. Nur ein Wert je Element unterscheidet sich von
// Karte zu Karte – der Inhalt eines Texts, der Link eines Bilds.
// Each element type has its own folder next to this file.

// The back of a card is built the same way as the front — each element says
// which side it sits on. Ids are unique across both sides.
export type CardSide = 'front' | 'back'

// What every element type has, no matter what it shows. Breite und Höhe in mm.
export type CardElementBase = {
  id: string
  name: string
  side: CardSide
  placement: ElementPlacement
  width: number
  height: number
  opacity: number
}

export type CardElement = TextElement

/** Macht aus einem Element des Sets eins zum Zeichnen. Das Backend kennt keine
    Kartenseiten – alles liegt vorn. Gezeichnet werden bisher nur Textfelder mit
    x/y-Position; andere (z.B. von anderen Programmen angelegt) fehlen noch. */
export function cardElementFromCardSetElement({
  id,
  data,
  rotation,
}: CardSetElement): CardElement | null {
  const { x, y } = data.position
  if (data.type !== 'TEXT' || x == null || y == null) return null

  return {
    id,
    name: data.name,
    type: 'text',
    side: 'front',
    placement: { x, y, rotation },
    width: data.width,
    height: data.height,
    opacity: data.opacity,
  }
}

// Sucht ein Element in allen Sets – die ids sind überall eindeutig.
function findCardSetElement(id: string) {
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

export function rotateElementBy(id: string, turnInDegrees: number) {
  const element = findCardSetElement(id)
  if (element) element.rotation += turnInDegrees
}

// What one card fills into the deck's elements, keyed by element id.
export type CardElementValues = Record<string, string>
