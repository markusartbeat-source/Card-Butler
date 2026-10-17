import { postOffice } from '../api/postOffice/postOffice'
import { currentProject } from '../project/currentProject'
import { projectImages } from './projectImages'

// Das Backend sperrt beim Hochladen das ganze Projekt. Gleichzeitige Uploads
// gäben dort ein falsches 412, darum laufen alle nacheinander, auch über
// mehrere Auswahlen hinweg.
let previousUploads = Promise.resolve()

/** Lädt Dateien nacheinander als Bilder ins Projekt hoch. Jedes fertige Bild
 *  kommt sofort vorn in die Bildliste. Scheitert eines, meldet die Poststelle
 *  das per Toast, und die übrigen laufen weiter. */
export function uploadImages(projectId: string, files: File[]) {
  previousUploads = previousUploads.then(async () => {
    for (const file of files) {
      try {
        const imageResource = await postOffice.images.uploadImage(projectId, file)
        // Inzwischen ein anderes Projekt offen: Dessen Liste bleibt unberührt.
        if (currentProject.value?.id === projectId) projectImages.value?.unshift(imageResource)
      } catch {
        // Weiter mit der nächsten Datei.
      }
    }
  })
  return previousUploads
}
