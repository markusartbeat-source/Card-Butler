import type {
  ElementData,
  HorizontalAlignment,
  VerticalAlignment,
} from '../../api/elements/elementsApi'
import { findCardSetElement } from '../cardElements'
import { saveElement } from '../saveElement'

// Wie der Text aussieht. Gilt auf allen Karten des Sets.

/** Gelten, solange das Backend keinen Wert hat. Neue Textfelder bekommen sie
    gleich mit – die Namen sind die aus ElementData. Schriftgröße in mm, Farbe
    als Hex-Wert (Daten, kein Styling). */
export const textAppearanceDefaults = { fontFamily: 'Arial', fontSize: 4, color: '#000000' }

/** Die Darstellung des Texts, fehlende Werte durch die Startwerte ersetzt. */
export function textAppearanceOf(data: ElementData | undefined) {
  return {
    fontFamily: data?.fontFamily ?? textAppearanceDefaults.fontFamily,
    fontSize: data?.fontSize ?? textAppearanceDefaults.fontSize,
    color: data?.color ?? textAppearanceDefaults.color,
  }
}

export type TextAppearance = ReturnType<typeof textAppearanceOf>

/** Stellt die Schrift des Texts um und speichert. Ist sie schon eingestellt,
    wird nichts gespeichert. */
export function changeFontFamily(id: string, fontFamily: string) {
  const element = findCardSetElement(id)
  if (!element || textAppearanceOf(element.data).fontFamily === fontFamily) return

  element.data.fontFamily = fontFamily
  saveElement(id)
}

/** Wie changeFontFamily – für die Schriftgröße in mm. */
export function changeFontSize(id: string, millimeters: number) {
  const element = findCardSetElement(id)
  if (!element || textAppearanceOf(element.data).fontSize === millimeters) return

  element.data.fontSize = millimeters
  saveElement(id)
}

// Die gespeicherte Farbe je Element, solange eine Vorschau läuft.
const colorsBeforePreview = new Map<string, string>()

/** Zeigt die Textfarbe sofort auf allen Karten, speichert aber nicht – z.B.
    beim Ziehen im Farbwähler. changeTextColor speichert danach einmal. */
export function previewTextColor(id: string, color: string) {
  const element = findCardSetElement(id)
  if (!element) return

  if (!colorsBeforePreview.has(id)) colorsBeforePreview.set(id, textAppearanceOf(element.data).color)
  element.data.color = color
}

/** Wie changeFontFamily – für die Textfarbe. Verglichen wird mit der Farbe vor
    einer Vorschau. */
export function changeTextColor(id: string, color: string) {
  const element = findCardSetElement(id)
  if (!element) return

  const savedColor = colorsBeforePreview.get(id) ?? textAppearanceOf(element.data).color
  colorsBeforePreview.delete(id)
  element.data.color = color
  if (savedColor !== color) saveElement(id)
}

/** Richtet den Text in seiner Box links, mittig oder rechts aus und speichert.
    Steht er schon so, wird nichts gespeichert. */
export function alignTextHorizontally(id: string, horizontal: HorizontalAlignment) {
  const element = findCardSetElement(id)
  if (!element || element.data.alignment.horizontal === horizontal) return

  element.data.alignment = { ...element.data.alignment, horizontal }
  saveElement(id)
}

/** Wie alignTextHorizontally – nur oben, mittig oder unten. Zu sehen nur bei
    fester Höhe, sonst umschließt die Box den Text. */
export function alignTextVertically(id: string, vertical: VerticalAlignment) {
  const element = findCardSetElement(id)
  if (!element || element.data.alignment.vertical === vertical) return

  element.data.alignment = { ...element.data.alignment, vertical }
  saveElement(id)
}
