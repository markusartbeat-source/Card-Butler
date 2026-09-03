import { snapdom } from '@zumer/snapdom'

// Turns one card in the page into a PNG and gives back its data URL. embedFonts
// puts the used fonts into the picture, so the text looks the same as on screen.
export async function cardToPngUrl(cardElement: Element) {
  const image = await snapdom.toPng(cardElement, { embedFonts: true, cache: 'full' })
  return image.src
}
