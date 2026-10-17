import { ref } from 'vue'
import type { ImageResource } from '../api/images/imagesApi'
import { postOffice } from '../api/postOffice/postOffice'
import { newerFirst } from '../api/postOffice/resource'

// Die Bilder der obersten Ebene des geöffneten Projekts, das neueste zuerst.
// null, solange sie nicht geladen sind.
export const projectImages = ref<ImageResource[] | null>(null)

/** Lädt die Bilder eines Projekts. Fehler meldet schon die Poststelle per Toast. */
export async function loadProjectImages(projectId: string) {
  try {
    projectImages.value = (await postOffice.images.loadImages(projectId)).sort(newerFirst)
  } catch {
    // Die Liste bleibt, wie sie war.
  }
}
