import type { ElementData } from '../api/elements/elementsApi'
import type { CardTool } from '../components/molecules/cardToolbarElements'
import { textAppearanceDefaults } from './text/textAppearance'

// Deckkraft, Ausrichtung und Lage sind bei allen neuen Elementen gleich.
type NewElementDefaults = Omit<ElementData, 'opacity' | 'alignment' | 'position'>

// Was je Werkzeug der Toolbar neu angelegt wird, Größe in mm. Welches Bild ein
// Bild-Element zeigt, wählt jede Karte selbst. Die anderen Werkzeuge legen noch
// nichts an.
const newElementDataByTool: Partial<Record<CardTool, () => NewElementDefaults>> = {
  text: () => ({
    name: dictionary.cardEditor.textElementName,
    type: 'TEXT',
    width: 40,
    height: 10,
    ...textAppearanceDefaults,
  }),
  image: () => ({
    name: dictionary.cardEditor.pictureElementName,
    type: 'PICTURE',
    width: 40,
    height: 30,
    radius: 0,
    imageId: null,
  }),
}

/** Ein neues Element des Werkzeugs, dessen Mitte auf dem gegebenen Punkt der
    Karte liegt (mm). null, wenn das Werkzeug noch nichts anlegt. Die
    Ausrichtung braucht das Backend auch beim Bild. */
export function newElementData(tool: CardTool, centerX: number, centerY: number): ElementData | null {
  const data = newElementDataByTool[tool]?.()
  if (!data) return null

  return {
    ...data,
    opacity: 1,
    alignment: { horizontal: 'LEFT', vertical: 'TOP' },
    position: { x: centerX - data.width / 2, y: centerY - data.height / 2 },
  }
}
