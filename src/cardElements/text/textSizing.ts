import { measureInMillimeters } from '../../card/millimeters'
import type { CardSetElement } from '../../cardSets/cardSets'
import { selectedElementNode } from '../../elementTransform/elementSelection'
import { findCardSetElement, resizeElement } from '../cardElements'
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

// Wird eine automatische Seite fest, behält sie die Größe, die sie gerade auf
// der offenen Karte hat – auf anderen Karten ist der Text ja anders lang.
// Messen geht nur am ausgewählten Feld.
function switchTextSizing(element: CardSetElement, sizing: TextSizing) {
  const previousSizing = textSizingOf(element)
  setTextSizing(element.id, sizing)
  const node = selectedElementNode.value
  if (node?.dataset.elementId !== element.id) return

  const size = measureInMillimeters(node)
  const { width, height } = element.data
  const isWidthFixedNow = previousSizing === 'autoWidth' && sizing !== 'autoWidth'
  const isHeightFixedNow = previousSizing !== 'fixed' && sizing === 'fixed'
  resizeElement(
    element.id,
    isWidthFixedNow ? roundUp(size.width) : width,
    isHeightFixedNow ? roundUp(size.height) : height,
  )
}

// Der Modus lebt nur lokal – gespeichert wird nur eine geänderte Größe.
function saveIfResized(element: CardSetElement, change: () => void) {
  const { width, height } = element.data
  change()
  if (element.data.width !== width || element.data.height !== height) saveElement(element.id)
}

/** Stellt um, wie das ausgewählte Textfeld zu seiner Größe kommt. */
export function changeTextSizing(id: string, sizing: TextSizing) {
  const element = findCardSetElement(id)
  if (element) saveIfResized(element, () => switchTextSizing(element, sizing))
}

/** Eine eingetippte Breite oder Höhe in mm. Ist die Seite gerade automatisch,
    wird sie fest: die Breite bei Auto-Breite (die Höhe wächst dann weiter mit),
    die Höhe immer zur festen Größe. */
export function changeTextSize(id: string, side: 'width' | 'height', millimeters: number) {
  const element = findCardSetElement(id)
  if (!element) return

  const sizing = textSizingOf(element)
  saveIfResized(element, () => {
    if (side === 'width' && sizing === 'autoWidth') switchTextSizing(element, 'autoHeight')
    if (side === 'height' && sizing !== 'fixed') switchTextSizing(element, 'fixed')
    const size = { ...element.data, [side]: millimeters }
    resizeElement(element.id, size.width, size.height)
  })
}
