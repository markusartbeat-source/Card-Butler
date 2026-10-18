import { ref } from 'vue'
import type { FolderResource } from '../api/folders/foldersApi'

// Die Ebene, deren Inhalt die Bilderseite zeigt: Projekt und Ordner, null =
// oberste Ebene. projectFolders und projectImages gehören zu ihr.
const shownLevel = ref<{ projectId: string; folderId: string | null } | null>(null)

/** Merkt sich die Ebene, die die Bilderseite ab jetzt zeigt. */
export function showLevel(projectId: string, folderId: string | null) {
  shownLevel.value = { projectId, folderId }
}

/** Ob die Bilderseite gerade diese Ebene zeigt. */
export function isLevelShown(projectId: string, folderId: string | null) {
  return shownLevel.value?.projectId === projectId && shownLevel.value.folderId === folderId
}

// Die Ordner von oben bis zum gezeigten, für den Pfad im Header. Leer auf der
// obersten Ebene und solange der Pfad lädt.
export const folderPath = ref<FolderResource[]>([])
