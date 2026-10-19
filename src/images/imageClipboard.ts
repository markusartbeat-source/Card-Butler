import { ref } from 'vue'
import type { ImageResource } from '../api/images/imagesApi'
import { showToast } from '../components/atoms/toaster'
import { isInInputField } from '../keyboard/isInInputField'

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
