import type { CornerRadii } from '../../card/cornerRadii'
import type { CardElementBase } from '../cardElements'

// Alles, was nur das Bild-Element betrifft, liegt in diesem Ordner. Welches Bild
// es zeigt, wählt jede Karte selbst – das Element ist nur der Rahmen dafür.
export type PictureElement = CardElementBase & {
  type: 'picture'
  width: number
  height: number
  cornerRadii: CornerRadii
}
