import type { FolderResource } from '../api/folders/foldersApi'
import { loadProjectImages, projectImages } from '../images/projectImages'
import { folderPath, isLevelShown, showLevel } from './currentFolder'
import { loadFolderPath } from './loadFolderPath'
import { loadProjectFolders, projectFolders } from './projectFolders'

/** Zeigt auf der Bilderseite eine Ebene (null = oberste): erst den Pfad bis
 *  nach oben, dann ihre Ordner und Bilder. Liefert false, wenn es den Ordner
 *  nicht gibt – Fehler meldet schon die Poststelle per Toast. */
export async function showFolder(projectId: string, folderId: string | null) {
  // Was schon zu sehen war, muss nicht geladen werden: So steht der Pfad beim
  // Hinein- und Hinausgehen sofort da.
  const knownFolders = [...folderPath.value, ...(projectFolders.value ?? [])]
  // Pfad und Inhalt der vorigen Ebene sollen nicht aufblitzen.
  showLevel(projectId, folderId)
  folderPath.value = []
  projectFolders.value = null
  projectImages.value = null

  let path: FolderResource[]
  try {
    path = await loadFolderPath(folderId, knownFolders)
  } catch {
    return false
  }

  // Inzwischen eine andere Ebene gezeigt: Die lädt selbst.
  if (!isLevelShown(projectId, folderId)) return true
  folderPath.value = path
  await Promise.all([loadProjectFolders(projectId, folderId), loadProjectImages(projectId, folderId)])
  return true
}
