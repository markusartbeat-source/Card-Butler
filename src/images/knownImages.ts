import { ref } from 'vue'
import type { ImageInfo, ImageResource } from '../api/images/imagesApi'

// Je Bild-ID, was die App über das Bild schon weiß (Name, Adresse) – aus allen
// Kartensets und Ebenen, die sie geladen hat. So zeigt eine Karte ihr Bild, ohne
// dass dessen Ordner geladen sein muss.
export const knownImages = ref<Record<string, ImageInfo>>({})

export function rememberImages(images: ImageResource[]) {
  for (const { id, data } of images) knownImages.value[id] = data
}
