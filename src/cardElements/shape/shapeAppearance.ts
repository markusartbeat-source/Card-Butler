import type { ElementData } from '../../api/elements/elementsApi'

// Wie Vierecke und Kreise aussehen. Gilt auf allen Karten des Sets.

/** Startwerte neuer Formen wie in Figma: hellgraue Füllung, Kontur ohne Stärke.
    Die Namen sind die aus ElementData, Farben als Hex-Wert (Daten, kein Styling). */
export const shapeAppearanceDefaults = {
  color: '#D9D9D9',
  border: { color: '#000000', lineType: 'SOLID', width: 0 },
} satisfies Pick<ElementData, 'color' | 'border'>
