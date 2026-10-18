import { postOffice } from '../api/postOffice/postOffice'
import { isLevelShown } from './currentFolder'
import { projectFolders } from './projectFolders'

/** Legt in einer Ebene (null = oberste) einen Ordner an und stellt ihn vorn in
 *  die Reihe. Liefert den neuen Ordner oder null – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function createFolder(projectId: string, parentId: string | null, name: string) {
  try {
    const folder = await postOffice.folders.createFolder(projectId, { name, parentId })
    // Inzwischen eine andere Ebene offen: Deren Reihe bleibt unberührt.
    if (isLevelShown(projectId, parentId)) projectFolders.value?.unshift(folder)
    return folder
  } catch {
    return null
  }
}
