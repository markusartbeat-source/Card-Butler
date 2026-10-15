// Alles, was das Backend über Elemente weiß und mit ihnen macht. Elemente
// gehören zum Kartenset und gelten für alle seine Karten.

export type ElementType = 'SQUARE' | 'CIRCLE' | 'LINE' | 'TEXT' | 'PICTURE'
export type HorizontalAlignment = 'LEFT' | 'CENTER' | 'RIGHT'
export type VerticalAlignment = 'TOP' | 'CENTER' | 'BOTTOM'

// Was ein Element speichert. Maße in mm; die Position ist die linke obere Ecke,
// gemessen von der linken oberen Ecke der Karte.
export type ElementData = {
  name: string
  type: ElementType
  opacity: number
  width: number
  height: number
  alignment: { horizontal: HorizontalAlignment; vertical: VerticalAlignment }
  position: { x: number; y: number }
}
