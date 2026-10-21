import type { CardSetData } from '../api/cardSets/cardSetsApi'
import type { CardElementValues } from '../cardElements/cardValues'
import type { CardSetElement } from '../cardSets/cardSets'

// What the export needs to know about a card of the project: enough to draw it.
// Elemente und Einstellungen (Farbe, Anschnitt) sind die ihres Sets.
export type ExportCard = {
  id: string
  values: CardElementValues
  elements: CardSetElement[]
  cardSetData: CardSetData
}
