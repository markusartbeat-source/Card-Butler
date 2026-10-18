// Alles, was das Backend über die Bilder eines Projekts weiß und mit ihnen macht.
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

// Was das Backend zu einem Bild speichert. Die Pixelmaße kennt es nicht.
export type ImageInfo = {
  /** Dateiname beim Hochladen. */
  name: string
  timestamp: string
  /** Größe in Byte. */
  size: number
  /** Ordner des Bildes, null = oberste Ebene. */
  folderId: string | null
  /** Adresse der Bilddatei, z.B. für `<img src>`. */
  location: string
}

export type ImageResource = Resource<ImageInfo>

// Die Bilder einer Ebene, ohne Ordner die oberste.
function imagesPath(projectId: string, folderId: string | null) {
  const query = folderId ? `?folderId=${encodeURIComponent(folderId)}` : ''
  return `/api/projects/${encodeURIComponent(projectId)}/images${query}`
}

/** Lädt die Bilder einer Ebene (null = oberste) eines Projekts. */
function loadImages(projectId: string, folderId: string | null) {
  return postOffice.request<ImageResource[]>(imagesPath(projectId, folderId))
}

/** Lädt eine Datei vom PC als Bild in eine Ebene (null = oberste) eines Projekts hoch. */
function uploadImage(projectId: string, folderId: string | null, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return postOffice.request<ImageResource>(imagesPath(projectId, folderId), {
    method: 'POST',
    body: formData,
  })
}

/** Benennt ein Bild um oder legt es in einen anderen Ordner. Das Backend
 *  ersetzt beides, darum immer Name und `folderId`. Ist `version` veraltet,
 *  antwortet es mit 412. */
function updateImage(imageId: string, imageData: Pick<ImageInfo, 'name' | 'folderId'>, version: number) {
  return postOffice.request<ImageResource>(`/api/images/${encodeURIComponent(imageId)}`, {
    method: 'PUT',
    body: imageData,
    version,
  })
}

/** Löscht ein Bild. Das Backend lehnt ab, solange es auf einer Karte benutzt
 *  wird (400); ist `version` veraltet, antwortet es mit 412. */
function deleteImage(imageId: string, version: number) {
  return postOffice.request<void>(`/api/images/${encodeURIComponent(imageId)}`, {
    method: 'DELETE',
    version,
  })
}

/** Fach `images` der Poststelle, Aufruf als `postOffice.images.…()`. */
export const imagesApi = { loadImages, uploadImage, updateImage, deleteImage }
