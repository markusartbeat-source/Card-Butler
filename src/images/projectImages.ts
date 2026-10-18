import { ref } from 'vue'
import type { ImageResource } from '../api/images/imagesApi'
import { postOffice } from '../api/postOffice/postOffice'
import { newerFirst } from '../api/postOffice/resource'
import { isLevelShown } from '../folders/currentFolder'

// Die Bilder der gezeigten Ebene des geöffneten Projekts, das neueste zuerst.
// null, solange sie nicht geladen sind.
export const projectImages = ref<ImageResource[] | null>(null)

/** Lädt die Bilder einer Ebene (null = oberste) in die Liste, sofern die Ebene
 *  dann noch gezeigt wird. Fehler meldet schon die Poststelle per Toast. */
export async function loadProjectImages(projectId: string, folderId: string | null) {
  try {
    const images = await postOffice.images.loadImages(projectId, folderId)
    if (isLevelShown(projectId, folderId)) projectImages.value = images.sort(newerFirst)
  } catch {
    // Die Liste bleibt, wie sie war.
  }
}
