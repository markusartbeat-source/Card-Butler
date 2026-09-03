import { snapdom } from '@zumer/snapdom'
import { cardFormat } from '../../card/cardFormat'

const millimetresPerInch = 25.4

// The resolution the export uses until the quality slider sets it.
export const defaultExportDpi = 300

// How many pixels a card becomes at the given resolution. Both sides come from
// the same dpi number, otherwise the picture ends up stretched.
export function cardPixelSize(dpi: number) {
  const { width, height } = cardFormat.value
  return {
    width: Math.round((width / millimetresPerInch) * dpi),
    height: Math.round((height / millimetresPerInch) * dpi),
  }
}

// Turns one card in the page into a PNG and gives back its data URL. width and
// height are the target pixels, so the picture is always the same size no matter
// how the card is drawn on screen; dpr: 1 keeps a retina display from silently
// doubling them. embedFonts puts the used fonts into the picture, so the text
// looks the same as on screen.
export async function cardToPngUrl(cardElement: Element, dpi: number) {
  const { width, height } = cardPixelSize(dpi)
  const image = await snapdom.toPng(cardElement, {
    width,
    height,
    dpr: 1,
    embedFonts: true,
    cache: 'full',
  })
  return image.src
}
