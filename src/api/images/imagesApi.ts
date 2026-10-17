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

/** Lädt die Bilder der obersten Ebene eines Projekts, also ohne Ordner. */
function loadImages(projectId: string) {
  return postOffice.request<ImageResource[]>(`/api/projects/${encodeURIComponent(projectId)}/images`)
}

/** Lädt eine Datei vom PC als Bild in die oberste Ebene eines Projekts hoch. */
function uploadImage(projectId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return postOffice.request<ImageResource>(`/api/projects/${encodeURIComponent(projectId)}/images`, {
    method: 'POST',
    body: formData,
  })
}

/** Fach `images` der Poststelle, Aufruf als `postOffice.images.…()`. */
export const imagesApi = { loadImages, uploadImage }
