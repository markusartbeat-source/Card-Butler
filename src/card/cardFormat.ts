import { ref } from 'vue'

// Wie groß eine Karte ist, in Millimetern – so misst man gedruckte Karten.
export type CardFormat = { width: number; height: number; cornerRadius: number }

// Die übliche Sammelkarte: Startformat neuer Sets. Danach hat jedes Set seine
// eigene Breite und Höhe (CardSetData), der Eckenradius gilt vorerst für alle.
export const cardFormat = ref<CardFormat>({ width: 63, height: 88, cornerRadius: 3 })

// How large a card is drawn in each view. 1 means real size on screen; showing
// a card at its true size is therefore just another number here. Fitting the
// editor's card to the viewport comes later.
export const gridZoom = 0.8
export const editorZoom = 1.6
// The export dialog shows its cards at about the 145 px of the Figma design: a
// 63 mm card is 238 px wide at zoom 1, so 145 / 238 is roughly this number.
// Rounded down, so six cards plus a scroll bar still fit into one row there.
export const exportZoom = 0.6

// Gibt die Größe einer Karte an CSS weiter, in mm wie gespeichert. Die Ecken
// runden sich bei allen Karten gleich.
export function cardFormatStyle({ width, height }: { width: number; height: number }) {
  return {
    '--card-width-mm': `${width}mm`,
    '--card-height-mm': `${height}mm`,
    '--card-corner-radius-mm': `${cardFormat.value.cornerRadius}mm`,
  }
}
