import type { CardElementBase } from '../cardElements'

// Everything about the text element lives in this folder: its shape here, how
// it looks on the card next to it, and later all of its settings.
export type TextElement = CardElementBase & {
  type: 'text'
}
