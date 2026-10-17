import type { ElementData } from '../../api/elements/elementsApi'
import { textAppearanceDefaults } from './textAppearance'

// Größe eines neuen Textfelds in mm.
const width = 40
const height = 10

/** Ein neues Textfeld, dessen Mitte auf dem gegebenen Punkt der Karte liegt (mm). */
export function newTextElementData(centerX: number, centerY: number): ElementData {
  return {
    name: dictionary.cardEditor.textElementName,
    type: 'TEXT',
    opacity: 1,
    width,
    height,
    alignment: { horizontal: 'LEFT', vertical: 'TOP' },
    position: { x: centerX - width / 2, y: centerY - height / 2 },
    ...textAppearanceDefaults,
  }
}
