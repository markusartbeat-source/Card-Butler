import { showDeletionToast } from '../deletion/showDeletionToast'
import { releaseDrag } from '../dragAndDrop/dragState'
import { playShredding } from '../dragAndDrop/shredding'
import { deleteImage } from './deleteImage'
import { projectImages } from './projectImages'

/** Das Bild verlässt die Liste sofort und wird im Feld geschreddert. Erst wenn
    die Schnipsel fallen, kommt die Oberfläche zurück und der Toast bietet an,
    das Bild an seinen alten Platz zu setzen. Gelöscht wird im Backend erst,
    wenn der Toast ohne „Rückgängig“ verschwunden ist. */
export async function deleteDroppedImage(imageIndex: number, imageElement: HTMLElement | null) {
  // Die Liste von jetzt: Wird inzwischen eine andere geladen, landet ein
  // „Rückgängig“ nicht dort.
  const images = projectImages.value
  const [deletedImage] = images?.splice(imageIndex, 1) ?? []
  if (!images || !deletedImage) return releaseDrag()

  await playShredding(imageElement)
  releaseDrag()

  showDeletionToast(
    dictionary.dropBar.imageDeleted,
    () => images.splice(imageIndex, 0, deletedImage),
    () => deleteImage(deletedImage),
  )
}
