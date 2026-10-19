import type { FolderResource } from '../api/folders/foldersApi'
import { postOffice } from '../api/postOffice/postOffice'
import { loadProjectFolders } from './projectFolders'

/** Nimmt einen Ordner sofort aus der Liste, in der er stand, und legt ihn danach
 *  im Backend in einen anderen Ordner (null = oberste Ebene). Liefert den
 *  geänderten Ordner oder null – Fehler meldet schon die Poststelle per Toast. */
export async function moveFolder(folder: FolderResource, parentId: string | null, folders: FolderResource[]) {
  // Die Liste kann inzwischen umsortiert sein, darum nicht über den alten Platz.
  const index = folders.indexOf(folder)
  if (index >= 0) folders.splice(index, 1)
  try {
    return await postOffice.folders.updateFolder(
      folder.projectId,
      folder.id,
      { name: folder.data.name, parentId },
      folder.version,
    )
  } catch {
    // Inzwischen geändert oder schon weg: Die Ebene, aus der er kam, zeigt
    // wieder, was das Backend hat – sofern sie noch zu sehen ist.
    await loadProjectFolders(folder.projectId, folder.data.parentId)
    return null
  }
}
