import type { FolderResource } from '../api/folders/foldersApi'
import { postOffice } from '../api/postOffice/postOffice'

/** Die Ordner von oben bis zu folderId (null = oberste Ebene, der Pfad ist dann
 *  leer). Ordner aus knownFolders werden nicht noch einmal geladen. Wirft, wenn
 *  es einen Ordner nicht gibt – Fehler meldet schon die Poststelle per Toast. */
export async function loadFolderPath(folderId: string | null, knownFolders: FolderResource[]) {
  const path: FolderResource[] = []
  let nextFolderId = folderId
  while (nextFolderId) {
    const folder =
      knownFolders.find((knownFolder) => knownFolder.id === nextFolderId) ??
      (await postOffice.folders.loadFolder(nextFolderId))
    path.unshift(folder)
    nextFolderId = folder.data.parentId
  }
  return path
}
