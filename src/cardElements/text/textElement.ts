import type { HorizontalAlignment, VerticalAlignment } from '../../api/elements/elementsApi'
import type { CardElementBase } from '../cardElements'
import type { TextAppearance } from './textAppearance'

// Everything about the text element lives in this folder: its shape here, how
// it looks on the card next to it, and later all of its settings.
export type TextElement = CardElementBase &
  TextAppearance & {
    type: 'text'
    horizontalAlignment: HorizontalAlignment
    verticalAlignment: VerticalAlignment
  }
