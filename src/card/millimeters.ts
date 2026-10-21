import { currentLanguage } from '../dictionary/dictionary'

// Die einzige Stelle, die zwischen Millimetern und Pixeln umrechnet. Ein Zoll
// sind 25,4 mm. CSS rechnet immer mit 96 Pixeln je Zoll, ein Export mit seiner
// eigenen Auflösung (dpi).
const millimetersPerInch = 25.4
const cssPixelsPerInch = 96

export function millimetersToPixels(millimeters: number, pixelsPerInch = cssPixelsPerInch) {
  return (millimeters / millimetersPerInch) * pixelsPerInch
}

export function pixelsToMillimeters(pixels: number, pixelsPerInch = cssPixelsPerInch) {
  return (pixels / pixelsPerInch) * millimetersPerInch
}

/** Die Größe, in der ein Element gerade zu sehen ist, in mm – ohne Drehung und
    Zoom und mit Nachkommastellen, so wie Moveable misst. */
export function measureInMillimeters(element: HTMLElement) {
  const { width, height } = getComputedStyle(element)
  return {
    width: pixelsToMillimeters(parseFloat(width)),
    height: pixelsToMillimeters(parseFloat(height)),
  }
}

// Millimeter fürs Panel: eine Nachkommastelle, mit dem Dezimalzeichen der
// gewählten Sprache. Ohne Wert ein leerer Text.
export function formatMillimeters(value: number | null | undefined) {
  return value?.toLocaleString(currentLanguage.value, { maximumFractionDigits: 1 }) ?? ''
}

// Eingetippte Millimeter: Komma und Punkt gehen beide. Leer oder ungültig → undefined.
export function parseMillimeters(text: string) {
  const value = Number(text.replace(',', '.'))
  return text.trim() && Number.isFinite(value) ? value : undefined
}
