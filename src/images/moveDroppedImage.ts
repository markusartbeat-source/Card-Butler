import { releaseDrag } from '../dragAndDrop/dragState'
import { flyDraggedIntoFolder } from '../folders/flyIntoFolder'
import { moveImage } from './moveImage'
import { projectImages } from './projectImages'

/** Das über einem Ordner losgelassene Bild verlässt die Ebene sofort und fliegt
    hinein. Das Backend erfährt es gleich, die Oberfläche wartet nur auf den
    Flug. */
export async function moveDroppedImage(imageIndex: number, imageElement: HTMLElement | null, folderId: string) {
  const images = projectImages.value
  const image = images?.[imageIndex]
  if (!images || !image) return releaseDrag()

  // Fehler meldet moveImage selbst und lädt die Ebene neu.
  moveImage(image, folderId, images)
  if (imageElement) await flyDraggedIntoFolder(imageElement, folderId)
  releaseDrag()
}
