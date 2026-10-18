import { ref } from 'vue'
import type { FolderResource } from '../api/folders/foldersApi'
import { postOffice } from '../api/postOffice/postOffice'
import { newerFirst } from '../api/postOffice/resource'
import { isLevelShown } from './currentFolder'

// Die Ordner der gezeigten Ebene des geöffneten Projekts, der neueste zuerst.
// null, solange sie nicht geladen sind.
export const projectFolders = ref<FolderResource[] | null>(null)

/** Lädt die Ordner einer Ebene (null = oberste) in die Reihe, sofern die Ebene
 *  dann noch gezeigt wird. Fehler meldet schon die Poststelle per Toast. */
export async function loadProjectFolders(projectId: string, parentId: string | null) {
  try {
    const folders = await postOffice.folders.loadFolders(projectId, parentId)
    if (isLevelShown(projectId, parentId)) projectFolders.value = folders.sort(newerFirst)
  } catch {
    // Die Liste bleibt, wie sie war.
  }
}
