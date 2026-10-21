import type { ElementData } from '../../api/elements/elementsApi'

// Wie Vierecke und Kreise aussehen. Gilt auf allen Karten des Sets.

/** Startwerte neuer Formen wie in Figma: hellgraue Füllung, Kontur ohne Stärke.
    Die Namen sind die aus ElementData, Farben als Hex-Wert (Daten, kein Styling). */
export const shapeAppearanceDefaults = {
  color: '#D9D9D9',
  border: { color: '#000000', lineType: 'SOLID', width: 0 },
} satisfies Pick<ElementData, 'color' | 'border'>

/** Die Darstellung der Form, fehlende Werte durch die Startwerte ersetzt – beim
    Kreis verlangt das Backend keine Farbe. */
export function shapeAppearanceOf(data: ElementData | undefined) {
  return { color: data?.color ?? shapeAppearanceDefaults.color }
}
