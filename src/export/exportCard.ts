import type { CardElementValues } from '../cardElements/cardElements'
import type { CardSetElement } from '../cardSets/cardSets'

// What the export needs to know about a card of the project: enough to draw it.
// Die Elemente sind die ihres Sets.
export type ExportCard = { id: string; elementValues: CardElementValues; elements: CardSetElement[] }
