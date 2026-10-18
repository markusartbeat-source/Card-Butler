// Alles, was das Backend über die Bildordner eines Projekts weiß und mit ihnen macht.
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

// Was das Backend zu einem Ordner speichert.
export type FolderData = {
  name: string
  /** Übergeordneter Ordner, null = oberste Ebene. */
  parentId: string | null
}

export type FolderResource = Resource<FolderData>

/** Lädt die Ordner einer Ebene (null = oberste) – in keiner festen Reihenfolge. */
function loadFolders(projectId: string, parentId: string | null) {
  const query = parentId ? `?parentId=${encodeURIComponent(parentId)}` : ''
  return postOffice.request<FolderResource[]>(`/api/projects/${encodeURIComponent(projectId)}/folders${query}`)
}

/** Lädt einen einzelnen Ordner, z.B. für den Pfad nach oben. */
function loadFolder(folderId: string) {
  return postOffice.request<FolderResource>(`/api/folders/${encodeURIComponent(folderId)}`)
}

/** Legt im Projekt einen Ordner an. */
function createFolder(projectId: string, folderData: FolderData) {
  return postOffice.request<FolderResource>(`/api/projects/${encodeURIComponent(projectId)}/folders`, {
    method: 'POST',
    body: folderData,
  })
}

/** Benennt einen Ordner um oder verschiebt ihn. Das Backend ersetzt den ganzen
 *  Ordner, darum immer Name und `parentId`. Ist `version` veraltet, antwortet
 *  es mit 412. */
function updateFolder(projectId: string, folderId: string, folderData: FolderData, version: number) {
  return postOffice.request<FolderResource>(
    `/api/projects/${encodeURIComponent(projectId)}/folders/${encodeURIComponent(folderId)}`,
    { method: 'PUT', body: folderData, version },
  )
}

/** Löscht einen Ordner. Das Backend lehnt ab, solange er nicht leer ist (400). */
function deleteFolder(folderId: string, version: number) {
  return postOffice.request<void>(`/api/folders/${encodeURIComponent(folderId)}`, {
    method: 'DELETE',
    version,
  })
}

/** Fach `folders` der Poststelle, Aufruf als `postOffice.folders.…()`. */
export const foldersApi = { loadFolders, loadFolder, createFolder, updateFolder, deleteFolder }
