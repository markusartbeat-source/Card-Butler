import { ref } from 'vue'

// How big a card really is. Millimetres, because that is what a printed card is
// measured in and what people will type into the settings later. Every card of
// the deck has the same format.
export type CardFormat = { width: number; height: number; cornerRadius: number }

// The standard trading card. Editing this comes with the card settings.
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

// Hands the format over to CSS, in millimetres just as it is stored.
export function cardFormatStyle({ width, height, cornerRadius }: CardFormat) {
  return {
    '--card-width-mm': `${width}mm`,
    '--card-height-mm': `${height}mm`,
    '--card-corner-radius-mm': `${cornerRadius}mm`,
  }
}
