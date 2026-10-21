import { snapdom } from '@zumer/snapdom'
import { millimetersToPixels } from '../../card/millimeters'
import { withPngResolution } from './pngResolution'

// The resolution the export starts with: what a print shop asks for.
export const defaultExportDpi = 300

// Wie viele Pixel eine Karte ihres Sets (Größe in mm) bei dieser Auflösung
// wird. Beide Seiten aus derselben dpi-Zahl, sonst wird das Bild gestreckt.
export function cardPixelSize({ width, height }: { width: number; height: number }, dpi: number) {
  return {
    width: Math.round(millimetersToPixels(width, dpi)),
    height: Math.round(millimetersToPixels(height, dpi)),
  }
}

// Turns one card in the page into a PNG file. width and height are the target
// pixels, so the picture is always the same size no matter how the card is drawn
// on screen; dpr: 1 keeps a retina display from silently doubling them.
// embedFonts puts the used fonts into the picture, so the text looks the same as
// on screen.
// cardSize ist die Größe der Karte in mm, die ihres Sets.
export async function cardToPngBlob(
  cardElement: Element,
  cardSize: { width: number; height: number },
  dpi: number,
) {
  const { width, height } = cardPixelSize(cardSize, dpi)
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
