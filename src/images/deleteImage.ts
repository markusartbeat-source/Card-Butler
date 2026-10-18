import type { ImageResource } from '../api/images/imagesApi'
import { postOffice } from '../api/postOffice/postOffice'
import { currentProject } from '../project/currentProject'
import { loadProjectImages } from './projectImages'

/** Löscht ein Bild im Backend – aus der Liste ist es da schon raus.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function deleteImage(image: ImageResource) {
  try {
    await postOffice.images.deleteImage(image.id, image.version)
    return true
  } catch {
    // Noch auf einer Karte benutzt, inzwischen geändert oder schon weg: Die
    // Liste zeigt wieder, was das Backend hat – außer, es ist schon ein anderes
    // Projekt offen.
    if (currentProject.value?.id === image.projectId) await loadProjectImages(image.projectId)
    return false
  }
}
