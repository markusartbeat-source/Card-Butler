import { computed, ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import { showSuccessToast } from '../components/atoms/toaster'
import { isLevelShown } from '../folders/currentFolder'
import { projectImages } from './projectImages'

// Das Backend sperrt beim Hochladen das ganze Projekt. Gleichzeitige Uploads
// gäben dort ein falsches 412, darum laufen alle nacheinander, auch über
// mehrere Auswahlen hinweg.
let previousUploads = Promise.resolve()

// Auswahlen, die gerade hochladen oder noch warten. Modulweit, damit die Seite
// es nach einem Wechsel weg und zurück noch weiß.
const unfinishedSelections = ref(0)

export const isUploadingImages = computed(() => unfinishedSelections.value > 0)

/** Lädt Dateien nacheinander als Bilder in eine Ebene (null = oberste) des
 *  Projekts hoch. Jedes fertige Bild kommt sofort vorn in die Bildliste.
 *  Scheitert eines, meldet die Poststelle das per Toast, und die übrigen laufen
 *  weiter. Am Ende meldet ein Toast, wie viele es geschafft haben. */
export function uploadImages(projectId: string, folderId: string | null, files: File[]) {
  unfinishedSelections.value++
  previousUploads = previousUploads.then(async () => {
    let uploadedCount = 0
    for (const file of files) {
      try {
        const imageResource = await postOffice.images.uploadImage(projectId, folderId, file)
        uploadedCount++
        // Inzwischen eine andere Ebene offen: Deren Liste bleibt unberührt.
        if (isLevelShown(projectId, folderId)) projectImages.value?.unshift(imageResource)
      } catch {
        // Weiter mit der nächsten Datei.
      }
    }
    if (uploadedCount > 0) showSuccessToast(dictionary.images.imagesUploaded(uploadedCount))
    unfinishedSelections.value--
  })
}
