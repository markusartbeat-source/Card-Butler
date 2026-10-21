import type { ElementData } from '../../api/elements/elementsApi'

// Größe eines neuen Bilds in mm.
const width = 40
const height = 30

/** Ein neues, leeres Bild, dessen Mitte auf dem gegebenen Punkt der Karte liegt
    (mm). Welches Bild es zeigt, wählt jede Karte selbst. Die Ausrichtung braucht
    das Backend, auch wenn ein Bild sie nicht nutzt. */
export function newPictureElementData(centerX: number, centerY: number): ElementData {
  return {
    name: dictionary.cardEditor.pictureElementName,
    type: 'PICTURE',
    opacity: 1,
    width,
    height,
    radius: 0,
    imageId: null,
    alignment: { horizontal: 'LEFT', vertical: 'TOP' },
    position: { x: centerX - width / 2, y: centerY - height / 2 },
  }
}
