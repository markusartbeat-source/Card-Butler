import { flyDraggedIntoPageDropTarget } from '../dragAndDrop/pageDropTarget'
import { releaseDrag } from '../dragAndDrop/dragState'
import { levelOfDropTarget } from '../folders/levelDropTarget'
import { moveImage } from './moveImage'
import { projectImages } from './projectImages'

/** Das über einer Ebene (Ordner oder Eintrag im Pfad) losgelassene Bild verlässt
    die gezeigte Ebene sofort und fliegt hinein. Das Backend erfährt es gleich,
    die Oberfläche wartet nur auf den Flug. */
export async function moveDroppedImage(imageIndex: number, imageElement: HTMLElement | null, dropTarget: string) {
  const images = projectImages.value
  const image = images?.[imageIndex]
  if (!images || !image) return releaseDrag()

  // Fehler meldet moveImage selbst und lädt die Ebene neu.
  moveImage(image, levelOfDropTarget(dropTarget), images)
  if (imageElement) await flyDraggedIntoPageDropTarget(imageElement, dropTarget)
  releaseDrag()
}
