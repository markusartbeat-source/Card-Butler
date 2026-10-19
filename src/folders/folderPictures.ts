import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import { newerFirst } from '../api/postOffice/resource'

// Je Ordner-ID die Adresse des Bildes, das auf dem Ordner zu sehen ist: das
// erste darin, wie es der Ordner selbst zeigt (neuestes zuerst). Ohne Eintrag
// bleibt der Ordner leer. Bleibt beim Wechsel der Ebene, so steht
// das Bild beim Zurückkommen sofort da und wird nur aufgefrischt.
export const folderPictures = ref<Record<string, string>>({})

/** Lädt das erste Bild eines Ordners neu. Die oberste Ebene (null) ist kein
 *  Ordner und hat keins. Fehler meldet schon die Poststelle per Toast. */
export async function loadFolderPicture(projectId: string, folderId: string | null) {
  if (!folderId) return
  try {
    // Das Backend kennt kein Vorschaubild, darum die Bilder des Ordners.
    const [firstImage] = (await postOffice.images.loadImages(projectId, folderId)).sort(newerFirst)
    if (firstImage) folderPictures.value[folderId] = firstImage.data.location
    else delete folderPictures.value[folderId]
  } catch {
    // Der Ordner behält, was er zeigt.
  }
}
