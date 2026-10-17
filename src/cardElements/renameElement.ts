import { findCardSetElement } from './cardElements'
import { saveElement } from './saveElement'

// Mehr lässt das Backend nicht zu.
export const maxElementNameLength = 200

/** Gibt dem Element einen neuen Namen und speichert ihn. Ein leerer Name ist
 *  nicht erlaubt – dann bleibt der alte. Liefert den Namen, den das Element
 *  jetzt trägt. */
export function renameElement(elementId: string, name: string) {
  const element = findCardSetElement(elementId)
  if (!element) return name

  const trimmedName = name.trim()
  if (trimmedName && trimmedName !== element.data.name) {
    element.data.name = trimmedName
    saveElement(elementId)
  }
  return element.data.name
}
