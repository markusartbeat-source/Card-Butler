import { ref } from 'vue'
import type { ImageResource } from '../api/images/imagesApi'
import { postOffice } from '../api/postOffice/postOffice'
import { showSuccessToast, showToast } from '../components/atoms/toaster'
import { isLevelShown } from '../folders/currentFolder'
import { isInInputField } from '../keyboard/isInInputField'
import { moveImage } from './moveImage'
import { projectImages } from './projectImages'
import { uploadImages } from './uploadImages'

// App-interne Zwischenablage für ein Bild, kopiert oder ausgeschnitten. Bleibt
// beim Wechsel der Ebene erhalten, damit es sich woanders einfügen lässt.
export const clipboardImage = ref<{ image: ImageResource; isCut: boolean } | null>(null)

/** Für aria-keyshortcuts an jeder Bildkachel. */
export const clipboardKeyShortcuts = 'Control+C Control+X'

/** Ob das Bild ausgeschnitten ist und auf das Einfügen wartet. Per ID, weil
    nach dem Neuladen einer Ebene ein anderes Objekt dasselbe Bild ist. */
export function isCutImage(image: ImageResource) {
  return !!clipboardImage.value?.isCut && clipboardImage.value.image.id === image.id
}

/** Strg+C kopiert, Strg+X schneidet das Bild aus (Mac: Cmd). Ein Toast
    bestätigt es, auch für Screenreader. In Eingabefeldern bleibt es beim
    Browser. */
export function copyOrCutImageOnKey(event: KeyboardEvent, image: ImageResource | undefined) {
  const key = event.key.toLowerCase()
  const isClipboardKey = (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && (key === 'c' || key === 'x')
  if (!image || !isClipboardKey || isInInputField(event)) return
  event.preventDefault()
  const isCut = key === 'x'
  clipboardImage.value = { image, isCut }
  showToast(isCut ? dictionary.images.imageCut : dictionary.images.imageCopied)
}

/** Strg+V (Mac: Cmd+V) fügt das Bild aus der Zwischenablage vorn in die gezeigte
    Ebene (null = oberste) ein, nur im Projekt, aus dem es stammt. Ausgeschnittenes
    wird verschoben, in seiner eigenen Ebene bleibt es, wo es ist. Kopiertes wird
    neu hochgeladen, das Backend kennt kein Kopieren. Eine gehaltene Taste zählt
    nur einmal, sonst entstünden viele Kopien. */
export async function pasteImageOnKey(event: KeyboardEvent, projectId: string, folderId: string | null) {
  const isPasteKey = (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 'v'
  const clipboard = clipboardImage.value
  if (!isPasteKey || !clipboard || clipboard.image.projectId !== projectId || isInInputField(event)) return
  event.preventDefault()
  if (event.repeat) return
  const { image, isCut } = clipboard

  if (isCut) {
    if (image.data.folderId === folderId) return
    clipboardImage.value = null
    // Seine Ebene ist nicht geladen, es steht also in keiner Liste. Fehler meldet
    // moveImage selbst.
    const movedImage = await moveImage(image, folderId, [])
    if (!movedImage) return
    if (isLevelShown(projectId, folderId)) projectImages.value?.unshift(movedImage)
    return showSuccessToast(dictionary.images.imagePasted)
  }

  try {
    const content = await postOffice.images.loadImageContent(image.id)
    // Den Toast danach bringt das Hochladen mit.
    uploadImages(projectId, folderId, [new File([content], image.data.name, { type: content.type })])
  } catch {
    // Fehler meldet schon die Poststelle per Toast.
  }
}
