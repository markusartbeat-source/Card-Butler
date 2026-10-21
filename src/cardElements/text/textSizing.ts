import { measureInMillimeters } from '../../card/millimeters'
import type { CardSetElement } from '../../cardSets/cardSets'
import { selectedElementNode } from '../../elementTransform/elementSelection'
import { findCardSetElement, resizeElement, resizeElementSide } from '../cardElements'
import { saveElement } from '../saveElement'

// Wie ein Textfeld zu seiner Größe kommt, wie in Figma: Breite und Höhe folgen
// dem Text, nur die Höhe folgt ihm, oder beides ist fest.
export type TextSizing = 'autoWidth' | 'autoHeight' | 'fixed'

// Das Backend kennt den Modus noch nicht – er lebt nur am Element im Set und
// geht beim Neuladen verloren. Ohne Modus gilt feste Größe, Breite und Höhe sind
// dann ja Zahlen. Nur über diese beiden Funktionen lesen und setzen: Dann bleibt
// der spätere Umzug ins Backend (Breite/Höhe = null) klein.
export function textSizingOf(element: CardSetElement | undefined): TextSizing {
  return element?.textSizing ?? 'fixed'
}

export function setTextSizing(id: string, sizing: TextSizing) {
  const element = findCardSetElement(id)
  if (element) element.textSizing = sizing
}

// Auf eine Nachkommastelle aufgerundet: So ist das Feld nie schmaler als sein
// Text, keine Zeile bricht neu um, und das Panel zeigt genau den gespeicherten Wert.
function roundUp(millimeters: number) {
  return Math.ceil(millimeters * 10) / 10
}

// Die Größe auf der offenen Karte – auf anderen Karten ist der Text ja anders
// lang. Messen geht nur am ausgewählten Feld.
function measuredSizeOf(element: CardSetElement) {
  const node = selectedElementNode.value
  return node?.dataset.elementId === element.id ? measureInMillimeters(node) : undefined
}

/** Breite und Höhe in mm, wie das Element gerade zu sehen ist: eine automatische
    Seite gemessen, sonst aus den Daten. */
export function visibleSizeOf(element: CardSetElement) {
  const sizing = textSizingOf(element)
  const { width, height } = element.data
  const size = sizing === 'fixed' ? undefined : measuredSizeOf(element)
  if (!size) return { width, height }

  return { width: sizing === 'autoWidth' ? size.width : width, height: size.height }
}

/** Stellt den Modus um, ohne zu speichern. Wird eine automatische Seite fest,
    behält sie die gemessene Größe. */
export function switchTextSizing(element: CardSetElement, sizing: TextSizing) {
  const previousSizing = textSizingOf(element)
  if (previousSizing === sizing) return

  setTextSizing(element.id, sizing)
  const size = measuredSizeOf(element)
  if (!size) return

  const { width, height } = element.data
  const isWidthFixedNow = previousSizing === 'autoWidth' && sizing !== 'autoWidth'
  const isHeightFixedNow = previousSizing !== 'fixed' && sizing === 'fixed'
  resizeElement(
    element.id,
    isWidthFixedNow ? roundUp(size.width) : width,
    isHeightFixedNow ? roundUp(size.height) : height,
  )
}

/** Stellt um, wie das ausgewählte Textfeld zu seiner Größe kommt. Der Modus lebt
    nur lokal – gespeichert wird nur eine geänderte Größe. */
export function changeTextSizing(id: string, sizing: TextSizing) {
  const element = findCardSetElement(id)
  if (!element) return

  switchTextSizing(element, sizing)
  saveElement(id)
}

/** Eine eingetippte Breite oder Höhe in mm. Ist die Seite gerade automatisch,
    wird sie fest: die Breite bei Auto-Breite (die Höhe wächst dann weiter mit),
    die Höhe immer zur festen Größe. */
export function changeTextSize(
  id: string,
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  const element = findCardSetElement(id)
  if (!element) return

  const sizing = textSizingOf(element)
  if (side === 'width' && sizing === 'autoWidth') switchTextSizing(element, 'autoHeight')
  if (side === 'height' && sizing !== 'fixed') switchTextSizing(element, 'fixed')
  resizeElementSide(id, side, millimeters, keepsAspectRatio)
  saveElement(id)
}
