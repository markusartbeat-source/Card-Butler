import type {
  ElementData,
  HorizontalAlignment,
  VerticalAlignment,
} from '../../api/elements/elementsApi'
import { changeElement } from '../cardElements'
import { fontStyleClasses, type FontStyle } from './fonts'

// Wie der Text aussieht. Gilt auf allen Karten des Sets.

/** Gelten, solange das Backend keinen Wert hat. Neue Textfelder bekommen sie
    gleich mit – die Namen sind die aus ElementData. Schriftgröße in mm, Farbe
    als Hex-Wert (Daten, kein Styling), Zeilenhöhe und Zeichenabstand als Faktor
    der Schriftgröße (Zeilenhöhe 1 = einfach). */
export const textAppearanceDefaults = {
  fontFamily: 'Arial',
  fontSize: 4,
  color: '#000000',
  lineHeight: 1,
  letterSpacing: 0,
}

/** Die Darstellung des Texts, fehlende Werte durch die Startwerte ersetzt. */
export function textAppearanceOf(data: ElementData | undefined) {
  return {
    fontFamily: data?.fontFamily ?? textAppearanceDefaults.fontFamily,
    fontSize: data?.fontSize ?? textAppearanceDefaults.fontSize,
    color: data?.color ?? textAppearanceDefaults.color,
    lineHeight: data?.lineHeight ?? textAppearanceDefaults.lineHeight,
    letterSpacing: data?.letterSpacing ?? textAppearanceDefaults.letterSpacing,
  }
}

// Einfacher Zeilenabstand (1 im Backend) wie „Auto“ in Figma bei Arial: 1,15
// der Schriftgröße. Sonst erbte der Text die 1,5 der Seite.
const singleLineHeight = 1.15

/** Die Zeilenhöhe fürs CSS (ohne Einheit, also je Schriftgröße). */
export function cssLineHeight(lineHeight: number) {
  return lineHeight * singleLineHeight
}

/** Die Zeilenhöhe als Faktor: 1 = einfach, 1,5 = anderthalbfach. Nur größer als 0. */
export function changeLineHeight(id: string, lineHeight: number) {
  if (lineHeight > 0) changeElement(id, (data) => (data.lineHeight = lineHeight))
}

/** Der Zeichenabstand als Faktor der Schriftgröße: 0,05 rückt die Buchstaben um
    5 % auseinander, negativ rücken sie zusammen. */
export function changeLetterSpacing(id: string, letterSpacing: number) {
  changeElement(id, (data) => (data.letterSpacing = letterSpacing))
}

export function changeFontFamily(id: string, fontFamily: string) {
  changeElement(id, (data) => (data.fontFamily = fontFamily))
}

/** Die Schriftgröße in mm. */
export function changeFontSize(id: string, millimeters: number) {
  changeElement(id, (data) => (data.fontSize = millimeters))
}

/** Der Schnitt des Texts, im Backend textStyle. Fehlt er oder ist er unbekannt
    (z.B. von einer KI eingetragen), gilt normal. */
export function fontStyleOf(data: ElementData | undefined): FontStyle {
  const textStyle = data?.textStyle
  return textStyle && Object.hasOwn(fontStyleClasses, textStyle) ? (textStyle as FontStyle) : 'regular'
}

export function changeFontStyle(id: string, fontStyle: FontStyle) {
  changeElement(id, (data) => (data.textStyle = fontStyle))
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
