import { ref } from 'vue'
import type { FolderResource } from '../api/folders/foldersApi'
import { postOffice } from '../api/postOffice/postOffice'
import { newerFirst } from '../api/postOffice/resource'

// Die Ordner der obersten Ebene des geöffneten Projekts, der neueste zuerst.
// null, solange sie nicht geladen sind.
export const projectFolders = ref<FolderResource[] | null>(null)

/** Lädt die Ordner eines Projekts. Fehler meldet schon die Poststelle per Toast. */
export async function loadProjectFolders(projectId: string) {
  try {
    projectFolders.value = (await postOffice.folders.loadFolders(projectId)).sort(newerFirst)
  } catch {
    // Die Liste bleibt, wie sie war.
  }
}
