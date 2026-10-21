import { refStoredInBrowser } from '../../browserStorage/refStoredInBrowser'

/** Wie das Bild im Rahmen liegt, in Anteilen des Rahmens – so wächst es mit ihm.
    centerX/centerY: Mitte des Bildes (0 bis 1 = linker bis rechter bzw. oberer
    bis unterer Rand), width: Breite des Bildes im Verhältnis zur Rahmenbreite
    (die Höhe folgt dem Bild), rotation in Grad im Uhrzeigersinn. */
export type PictureCrop = { centerX: number; centerY: number; width: number; rotation: number }

// Das Backend kennt am Kartenwert noch keinen Ausschnitt. Den merkt sich deshalb
// der Browser – je Karte, Element und Bild: Ein neu gewähltes Bild beginnt ohne
// Ausschnitt, ein wieder gewähltes mit seinem alten.
const crops = refStoredInBrowser<Record<string, PictureCrop>>('pictureCropsInFrame', {})

function cropKey(cardId: string, elementId: string, imageId: string) {
  return `${cardId}/${elementId}/${imageId}`
}

/** Der Ausschnitt des Bildes im Element auf dieser Karte, undefined = keiner. */
export function pictureCropOf(cardId: string, elementId: string, imageId: string) {
  return crops.value[cropKey(cardId, elementId, imageId)]
}

export function setPictureCrop(cardId: string, elementId: string, imageId: string, crop: PictureCrop) {
  crops.value = { ...crops.value, [cropKey(cardId, elementId, imageId)]: crop }
}

/** So liegt ein Bild ohne eigenen Ausschnitt: Es füllt den Rahmen, mittig und
    ungedreht. Die Seitenverhältnisse sind Breite / Höhe. */
export function coverCrop(pictureAspectRatio: number, frameAspectRatio: number): PictureCrop {
  return { centerX: 0.5, centerY: 0.5, width: Math.max(1, pictureAspectRatio / frameAspectRatio), rotation: 0 }
}
