import { computed, ref, shallowRef, watch } from 'vue'
import type { ImageResource } from '../../api/images/imagesApi'
import { postOffice } from '../../api/postOffice/postOffice'
import { newerFirst } from '../../api/postOffice/resource'
import { rememberImages } from '../../images/knownImages'
import { currentProject } from '../../project/currentProject'

/** Die Suche der Bildwahl nach dem Bildnamen, über alle Ordner des Projekts.
    Das Backend listet Bilder nur je Ebene, darum lädt das erste Suchen alle
    Ebenen nacheinander – die Treffer erscheinen, sobald ihre Ebene da ist.
    forgetImages verwirft sie wieder (beim nächsten Öffnen der Liste). */
export function usePictureSearch() {
  const search = ref('')
  const allImages = shallowRef<ImageResource[]>([])

  // Zählt bei jedem Verwerfen hoch – ein älteres Laden hört dann auf.
  let loadingRound = 0
  let hasStartedLoading = false

  // Fehler meldet schon die Poststelle per Toast, es bleibt bei den Bildern bis dahin.
  async function loadAllImagesOnce() {
    const projectId = currentProject.value?.id
    if (hasStartedLoading || !projectId) return
    hasStartedLoading = true
    const round = loadingRound

    // Ebenen, die noch dran sind (null = oberste); jede bringt ihre Unterordner mit.
    const folderIds: (string | null)[] = [null]
    try {
      for (let index = 0; index < folderIds.length; index++) {
        const [folders, images] = await Promise.all([
          postOffice.folders.loadFolders(projectId, folderIds[index]),
          postOffice.images.loadImages(projectId, folderIds[index]),
        ])
        if (round !== loadingRound) return
        folderIds.push(...folders.map((folder) => folder.id))
        allImages.value = [...allImages.value, ...images].sort(newerFirst)
        rememberImages(images)
      }
    } catch {
      // Die übrigen Ebenen fehlen dann.
    }
  }

  watch(search, (text) => {
    if (text.trim()) loadAllImagesOnce()
  })

  const foundImages = computed(() => {
    const word = search.value.trim().toLowerCase()
    return allImages.value.filter((image) => image.data.name.toLowerCase().includes(word))
  })

  function forgetImages() {
    loadingRound++
    hasStartedLoading = false
    allImages.value = []
  }

  return { search, foundImages, forgetImages }
}
