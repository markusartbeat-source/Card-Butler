import type { ElementData } from '../../api/elements/elementsApi'
import { changeElement, findCardSetElement } from '../cardElements'

// Wie Vierecke, Kreise und Linien aussehen. Gilt auf allen Karten des Sets.

type Border = NonNullable<ElementData['border']>

/** Startwerte neuer Formen wie in Figma: hellgraue Füllung, Kontur ohne Stärke.
    Die Namen sind die aus ElementData, Farben als Hex-Wert (Daten, kein Styling). */
export const shapeAppearanceDefaults = {
  color: '#D9D9D9',
  border: { color: '#000000', lineType: 'SOLID', width: 0 },
} satisfies Pick<ElementData, 'color' | 'border'>

/** Die Darstellung der Form, fehlende Werte durch die Startwerte ersetzt – beim
    Kreis verlangt das Backend weder Farbe noch Kontur. */
export function shapeAppearanceOf(data: ElementData | undefined) {
  return {
    color: data?.color ?? shapeAppearanceDefaults.color,
    border: data?.border ?? shapeAppearanceDefaults.border,
  }
}

/** Startwerte neuer Linien: schwarz, durchgezogen, 0,5 mm stark. Bei der Linie
    liegen Farbe, Art und Stärke direkt am Element, nicht in einer Kontur. */
export const lineAppearanceDefaults = {
  color: '#000000',
  lineType: 'SOLID',
  lineWidth: 0.5,
} satisfies Pick<ElementData, 'color' | 'lineType' | 'lineWidth'>

/** Die Darstellung der Linie, fehlende Werte durch die Startwerte ersetzt. */
export function lineAppearanceOf(data: ElementData | undefined) {
  return {
    color: data?.color ?? lineAppearanceDefaults.color,
    lineType: data?.lineType ?? lineAppearanceDefaults.lineType,
    lineWidth: data?.lineWidth ?? lineAppearanceDefaults.lineWidth,
  }
}

// So niedrig wird die Box einer Linie höchstens – das Backend verlangt eine Höhe
// über 0, auch bei Strichstärke 0.
const minimumLineBoxHeight = 0.1

/** Der Strich der Form: bei Viereck und Kreis die Kontur, bei der Linie die
    Linie selbst. Stärke in mm. */
export function strokeOf(data: ElementData | undefined): Border {
  if (data?.type !== 'LINE') return shapeAppearanceOf(data).border
  const { color, lineType, lineWidth } = lineAppearanceOf(data)
  return { color, lineType, width: lineWidth }
}

// Die Box der Linie ist so hoch wie ihr Strich.
function applyStroke(data: ElementData, change: Partial<Border>) {
  const stroke = { ...strokeOf(data), ...change }
  if (data.type !== 'LINE') {
    data.border = stroke
    return
  }
  data.color = stroke.color
  data.lineType = stroke.lineType
  data.lineWidth = stroke.width
  data.height = Math.max(stroke.width, minimumLineBoxHeight)
}

/** Zeigt einen geänderten Strich sofort auf allen Karten – z.B. beim Ziehen im
    Farbwähler. changeStroke speichert danach einmal. */
export function previewStroke(id: string, change: Partial<Border>) {
  const element = findCardSetElement(id)
  if (element) applyStroke(element.data, change)
}

/** Ändert einen Teil des Strichs, z.B. seine Stärke in mm (0 = keine Kontur). */
export function changeStroke(id: string, change: Partial<Border>) {
  changeElement(id, (data) => applyStroke(data, change))
}
