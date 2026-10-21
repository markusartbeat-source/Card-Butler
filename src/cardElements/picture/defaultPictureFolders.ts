import { refStoredInBrowser } from '../../browserStorage/refStoredInBrowser'

// Das Backend kennt am Bild-Element noch keinen Standard-Ordner. Den merkt sich
// deshalb der Browser, je Element-id.
const defaultFolderIds = refStoredInBrowser<Record<string, string>>('defaultPictureFolderIds', {})

/** Der Ordner, in dem die Bildwahl eines Elements beginnt, null = keiner. */
export function defaultFolderIdOf(elementId: string) {
  return defaultFolderIds.value[elementId] ?? null
}

/** Setzt den Standard-Ordner eines Elements, null entfernt ihn. */
export function setDefaultFolder(elementId: string, folderId: string | null) {
  const stored = { ...defaultFolderIds.value }
  if (folderId) stored[elementId] = folderId
  else delete stored[elementId]
  defaultFolderIds.value = stored
}
