import type { ImageResource } from '../api/images/imagesApi'
import { postOffice } from '../api/postOffice/postOffice'
import { loadProjectImages } from './projectImages'

/** Löscht ein Bild im Backend – aus der Liste ist es da schon raus.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function deleteImage(image: ImageResource) {
  try {
    await postOffice.images.deleteImage(image.id, image.version)
    return true
  } catch {
    // Noch auf einer Karte benutzt, inzwischen geändert oder schon weg: Die
    // Ebene des Bildes zeigt wieder, was das Backend hat – sofern sie noch zu
    // sehen ist.
    await loadProjectImages(image.projectId, image.data.folderId)
    return false
  }
}
