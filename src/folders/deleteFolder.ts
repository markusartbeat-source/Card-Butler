import type { FolderResource } from '../api/folders/foldersApi'
import { postOffice } from '../api/postOffice/postOffice'
import { loadProjectFolders } from './projectFolders'

// Das Backend löscht nur leere Ordner, darum von unten nach oben: erst jeder
// Unterordner samt Inhalt, dann die Bilder, zuletzt der Ordner selbst. Alles
// nacheinander, weil das Backend das Projekt je Änderung sperrt.
async function deleteWithContent(folder: FolderResource) {
  const subfolders = await postOffice.folders.loadFolders(folder.projectId, folder.id)
  for (const subfolder of subfolders) await deleteWithContent(subfolder)
  const images = await postOffice.images.loadImages(folder.projectId, folder.id)
  for (const image of images) await postOffice.images.deleteImage(image.id, image.version)
  await postOffice.folders.deleteFolder(folder.id, folder.version)
}

/** Löscht einen Ordner samt Inhalt im Backend – aus der Reihe ist er da schon
 *  raus. Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per
 *  Toast. */
export async function deleteFolder(folder: FolderResource) {
  try {
    await deleteWithContent(folder)
    return true
  } catch {
    // Z.B. ein Bild darin ist noch auf einer Karte benutzt: Was bis dahin
    // gelöscht ist, bleibt weg, der Ordner bleibt. Seine Ebene zeigt wieder,
    // was das Backend hat – sofern sie noch zu sehen ist.
    await loadProjectFolders(folder.projectId, folder.data.parentId)
    return false
  }
}
