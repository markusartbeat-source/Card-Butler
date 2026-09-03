import type { CardElementValues } from '../cardElements/cardElements'

// What the export needs to know about a card of the project: enough to draw it.
export type ExportCard = { id: string; number: number; elementValues: CardElementValues }
