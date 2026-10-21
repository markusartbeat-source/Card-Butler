import type { ElementData } from '../../api/elements/elementsApi'
import { changeElement, findCardSetElement } from '../cardElements'

// Wie Vierecke und Kreise aussehen. Gilt auf allen Karten des Sets.

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

/** Zeigt eine geänderte Kontur sofort auf allen Karten – z.B. beim Ziehen im
    Farbwähler. changeBorder speichert danach einmal. */
export function previewBorder(id: string, change: Partial<Border>) {
  const element = findCardSetElement(id)
  if (element) element.data.border = { ...shapeAppearanceOf(element.data).border, ...change }
}

/** Ändert einen Teil der Kontur, z.B. ihre Stärke in mm (0 = keine Kontur). */
export function changeBorder(id: string, change: Partial<Border>) {
  changeElement(id, (data) => (data.border = { ...shapeAppearanceOf(data).border, ...change }))
}
