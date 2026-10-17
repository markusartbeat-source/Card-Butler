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

/** Stellt um, wie das ausgewählte Textfeld zu seiner Größe kommt. Wird eine
    automatische Seite fest, behält sie die Größe, die sie gerade auf der offenen
    Karte hat – auf anderen Karten ist der Text ja anders lang. Gespeichert wird
    nur eine geänderte Größe. */
export function changeTextSizing(id: string, sizing: TextSizing) {
  const element = findCardSetElement(id)
  if (!element) return

  const previousSizing = textSizingOf(element)
  setTextSizing(id, sizing)
  const node = selectedElementNode.value
  if (node?.dataset.elementId !== id) return

  const size = measureInMillimeters(node)
  const { width, height } = element.data
  const isWidthFixedNow = previousSizing === 'autoWidth' && sizing !== 'autoWidth'
  const isHeightFixedNow = previousSizing !== 'fixed' && sizing === 'fixed'
  const newWidth = isWidthFixedNow ? roundUp(size.width) : width
  const newHeight = isHeightFixedNow ? roundUp(size.height) : height
  if (newWidth === width && newHeight === height) return

  resizeElement(id, newWidth, newHeight)
  saveElement(id)
}
