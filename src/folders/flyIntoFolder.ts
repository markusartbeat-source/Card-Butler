import { flyInto } from '../animation/flyInto'
import { showArrival } from '../animation/showArrival'

// Der Weg in einen Ordner ist meist weiter als der in ein Feld der Drop-Leiste.
const flightDurationInMilliseconds = 400

/** Die id, die jeder Ordner auf der Seite trägt, damit etwas in ihn fliegen kann. */
export function folderElementId(folderId: string) {
  return `folder-${folderId}`
}

/** Lässt ein Element, z.B. eine Bildkachel, in einen Ordner auf der Seite
 *  fliegen. Danach bleibt es unsichtbar, bis der Aufrufer es wegnimmt. Ohne
 *  den Ordner auf der Seite fliegt nichts. */
export async function flyIntoFolder(element: HTMLElement, folderId: string) {
  const folderElement = document.getElementById(folderElementId(folderId))
  if (!folderElement || !element.isConnected) return
  await flyInto(element, folderElement.getBoundingClientRect(), flightDurationInMilliseconds)
  showArrival(folderElement)
}
