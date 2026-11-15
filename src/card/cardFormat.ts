import { ref } from 'vue'
import { refStoredInBrowser } from '../browserStorage/refStoredInBrowser'
import type { CardSet } from '../cardSets/cardSets'
import { cornerRadiiStyle, uniformCornerRadii, type CornerRadii } from './cornerRadii'

// Wie groß eine Karte ist, in Millimetern – so misst man gedruckte Karten.
export type CardFormat = { width: number; height: number; cornerRadius: number }

// Die übliche Sammelkarte: Startformat neuer Sets. Danach hat jedes Set seine
// eigene Breite und Höhe (CardSetData) und seine eigenen Ecken.
export const cardFormat = ref<CardFormat>({ width: 63, height: 88, cornerRadius: 3 })

// Das Backend kennt am Set noch keine Ecken. Die merkt sich deshalb der Browser,
// je Set-id. Nur über diese beiden Funktionen lesen und setzen: Dann bleibt der
// spätere Umzug ins Backend klein.
const cardCornerRadii = refStoredInBrowser<Record<string, CornerRadii>>('cardCornerRadii', {})

/** Die Rundung jeder Kartenecke eines Sets in mm. */
export function cardCornerRadiiOf(cardSetId: string) {
  return cardCornerRadii.value[cardSetId] ?? uniformCornerRadii(cardFormat.value.cornerRadius)
}

export function changeCardCornerRadii(cardSetId: string, radii: CornerRadii) {
  cardCornerRadii.value = { ...cardCornerRadii.value, [cardSetId]: radii }
}

// How large a card is drawn in each view. 1 means real size on screen; showing
// a card at its true size is therefore just another number here. Fitting the
// editor's card to the viewport comes later.
export const gridZoom = 0.8
export const editorZoom = 1.6
// The export dialog shows its cards at about the 145 px of the Figma design: a
// 63 mm card is 238 px wide at zoom 1, so 145 / 238 is roughly this number.
// Rounded down, so six cards plus a scroll bar still fit into one row there.
export const exportZoom = 0.6

// Gibt Größe und Ecken der Karten eines Sets an CSS weiter, in mm wie gespeichert.
export function cardFormatStyle({ id, data }: CardSet) {
  return {
    '--card-width-mm': `${data.width}mm`,
    '--card-height-mm': `${data.height}mm`,
    '--card-corner-radius-mm': cornerRadiiStyle(cardCornerRadiiOf(id)),
  }
}
