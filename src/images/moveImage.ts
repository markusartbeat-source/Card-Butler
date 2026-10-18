import type { ImageResource } from '../api/images/imagesApi'
import { postOffice } from '../api/postOffice/postOffice'
import { loadProjectImages } from './projectImages'

/** Nimmt ein Bild sofort aus der Liste, in der es stand, und legt es danach im
 *  Backend in einen Ordner (null = oberste Ebene). Liefert das geänderte Bild
 *  oder null – Fehler meldet schon die Poststelle per Toast. */
export async function moveImage(image: ImageResource, folderId: string | null, images: ImageResource[]) {
  // Die Liste kann inzwischen umsortiert sein, darum nicht über den alten Platz.
  const index = images.indexOf(image)
  if (index >= 0) images.splice(index, 1)
  try {
    return await postOffice.images.updateImage(image.id, { name: image.data.name, folderId }, image.version)
  } catch {
    // Inzwischen geändert oder schon weg: Die Ebene, aus der es kam, zeigt
    // wieder, was das Backend hat – sofern sie noch zu sehen ist.
    await loadProjectImages(image.projectId, image.data.folderId)
    return null
  }
}
