import { findCardSetElement } from '../cardElements'

// Wie ein Textfeld zu seiner Größe kommt, wie in Figma: Breite und Höhe folgen
// dem Text, nur die Höhe folgt ihm, oder beides ist fest.
export type TextSizing = 'autoWidth' | 'autoHeight' | 'fixed'

// Das Backend kennt den Modus noch nicht – er lebt nur am Element im Set und
// geht beim Neuladen verloren. Ohne Modus gilt feste Größe, Breite und Höhe sind
// dann ja Zahlen. Nur über diese beiden Funktionen lesen und setzen: Dann bleibt
// der spätere Umzug ins Backend (Breite/Höhe = null) klein.
export function textSizingOf(id: string): TextSizing {
  return findCardSetElement(id)?.textSizing ?? 'fixed'
}

export function setTextSizing(id: string, sizing: TextSizing) {
  const element = findCardSetElement(id)
  if (element) element.textSizing = sizing
}
