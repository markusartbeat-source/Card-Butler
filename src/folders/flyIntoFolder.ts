import { flyInto } from '../animation/flyInto'
import { playRipple } from '../directives/ripple'
import { flyDraggedCopy } from '../dragAndDrop/draggedCopyFlight'

// Der Weg in einen Ordner ist meist weiter als der in ein Feld der Drop-Leiste.
const flightDurationInMilliseconds = 400

// Über dem Ordner Losgelassenes hängt schon dort, sein Weg ist kurz.
const droppedFlightDurationInMilliseconds = 200

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

/** Wie flyIntoFolder, aber für etwas über dem Ordner Losgelassenes: Statt des
 *  Elements fliegt eine Kopie von dort hinein, wo die gezogene Kopie zuletzt
 *  hing. Das Element selbst steht dann noch an seinem alten Platz. */
export async function flyDraggedIntoFolder(element: HTMLElement, folderId: string) {
  const folderElement = document.getElementById(folderElementId(folderId))
  if (!folderElement) return
  await flyDraggedCopy(element, folderElement.getBoundingClientRect(), droppedFlightDurationInMilliseconds)
  showArrival(folderElement)
}

// Der Ordner zeigt, dass etwas angekommen ist: Er schwillt kurz an, federt
// zurück, und aus seiner Mitte läuft der Kreis wie beim Klicken.
function showArrival(folderElement: HTMLElement) {
  const rect = folderElement.getBoundingClientRect()
  playRipple(folderElement, rect.left + rect.width / 2, rect.top + rect.height / 2)
  folderElement.animate(
    [{ scale: 1 }, { scale: 1.15, offset: 0.35 }, { scale: 0.97, offset: 0.7 }, { scale: 1 }],
    { duration: 400, easing: 'ease-out' },
  )
}
