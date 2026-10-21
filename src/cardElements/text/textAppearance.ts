import type {
  ElementData,
  HorizontalAlignment,
  VerticalAlignment,
} from '../../api/elements/elementsApi'
import { changeElement } from '../cardElements'

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

export function changeFontFamily(id: string, fontFamily: string) {
  changeElement(id, (data) => (data.fontFamily = fontFamily))
}

/** Die Schriftgröße in mm. */
export function changeFontSize(id: string, millimeters: number) {
  changeElement(id, (data) => (data.fontSize = millimeters))
}

/** Richtet den Text in seiner Box links, mittig oder rechts aus. */
export function alignTextHorizontally(id: string, horizontal: HorizontalAlignment) {
  changeElement(id, (data) => (data.alignment = { ...data.alignment, horizontal }))
}

/** Wie alignTextHorizontally – nur oben, mittig oder unten. Zu sehen nur bei
    fester Höhe, sonst umschließt die Box den Text. */
export function alignTextVertically(id: string, vertical: VerticalAlignment) {
  changeElement(id, (data) => (data.alignment = { ...data.alignment, vertical }))
}
