import { snapdom } from '@zumer/snapdom'
import { cardFormat } from '../../card/cardFormat'
import { withPngResolution } from './pngResolution'

const millimetresPerInch = 25.4

// The resolution the export starts with: what a print shop asks for.
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

// Turns one card in the page into a PNG file. width and height are the target
// pixels, so the picture is always the same size no matter how the card is drawn
// on screen; dpr: 1 keeps a retina display from silently doubling them.
// embedFonts puts the used fonts into the picture, so the text looks the same as
// on screen.
export async function cardToPngBlob(cardElement: Element, dpi: number) {
  const { width, height } = cardPixelSize(dpi)
  const pngFile = await snapdom.toBlob(cardElement, {
    type: 'png',
    width,
    height,
    dpr: 1,
    embedFonts: true,
    cache: 'full',
  })

  // snapdom writes pixels only, so the millimetres are added afterwards.
  return await withPngResolution(pngFile, dpi)
}
