import { ref } from 'vue'
import type { FolderResource } from '../../api/folders/foldersApi'
import type { ImageResource } from '../../api/images/imagesApi'
import { postOffice } from '../../api/postOffice/postOffice'
import { newerFirst } from '../../api/postOffice/resource'
import { loadFolderPicture } from '../../folders/folderPictures'
import { loadFolderPath } from '../../folders/loadFolderPath'
import { rememberImages } from '../../images/knownImages'
import { currentProject } from '../../project/currentProject'

/** Die Ebene der Projektbilder, die die Bildwahl gerade zeigt: ihre Ordner und
    Bilder (das neueste zuerst) und der Weg von oben bis hierher. Eigenständig –
    die Bilderseite zeigt ihre eigene Ebene. Startet leer, erst
    showStartLevel lädt etwas – so gehen keine Anfragen raus, solange niemand
    die Liste öffnet. */
export function usePictureLevel() {
  // Die Ordner von oben bis zur gezeigten Ebene, leer = oberste.
  const path = ref<FolderResource[]>([])
  const folders = ref<FolderResource[]>([])
  const images = ref<ImageResource[]>([])

  // Fehler meldet schon die Poststelle per Toast, die Ebene bleibt dann leer.
  async function show(folderPath: FolderResource[]) {
    const projectId = currentProject.value?.id
    const folderId = folderPath.at(-1)?.id ?? null
    path.value = folderPath
    folders.value = []
    images.value = []
    if (!projectId) return

    try {
      const [loadedFolders, loadedImages] = await Promise.all([
        postOffice.folders.loadFolders(projectId, folderId),
        postOffice.images.loadImages(projectId, folderId),
      ])
      // Inzwischen eine andere Ebene gezeigt: Die lädt selbst.
      if ((path.value.at(-1)?.id ?? null) !== folderId) return
      folders.value = loadedFolders.sort(newerFirst)
      images.value = loadedImages.sort(newerFirst)
      rememberImages(loadedImages)
      loadedFolders.forEach((folder) => loadFolderPicture(projectId, folder.id))
    } catch {
      // Die Ebene bleibt leer.
    }
  }

  let hasShownLevel = false

  /** Die Ebene beim Öffnen: der Ordner startFolderId, ohne ihn beim ersten Mal
      die oberste – danach bleibt die gezeigte. Liefert false, wenn es den Ordner
      nicht gibt; dann die oberste Ebene. */
  async function showStartLevel(startFolderId: string | null) {
    if (hasShownLevel && (!startFolderId || path.value.at(-1)?.id === startFolderId)) return true
    hasShownLevel = true

    try {
      await show(await loadFolderPath(startFolderId, [...path.value, ...folders.value]))
      return true
    } catch {
      await show([])
      return false
    }
  }

  return {
    path,
    folders,
    images,
    showStartLevel,
    openFolder: (folder: FolderResource) => show([...path.value, folder]),
    leaveFolder: () => show(path.value.slice(0, -1)),
  }
}
