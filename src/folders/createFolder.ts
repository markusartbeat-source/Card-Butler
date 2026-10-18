import { postOffice } from '../api/postOffice/postOffice'
import { currentProject } from '../project/currentProject'
import { projectFolders } from './projectFolders'

/** Legt in der obersten Ebene einen Ordner an und stellt ihn vorn in die
 *  Reihe. Liefert den neuen Ordner oder null – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function createFolder(projectId: string, name: string) {
  try {
    const folder = await postOffice.folders.createFolder(projectId, { name, parentId: null })
    // Inzwischen ein anderes Projekt offen: Dessen Reihe bleibt unberührt.
    if (currentProject.value?.id === projectId) projectFolders.value?.unshift(folder)
    return folder
  } catch {
    return null
  }
}
