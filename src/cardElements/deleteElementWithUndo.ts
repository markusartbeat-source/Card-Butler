import type { CardSet } from '../cardSets/cardSets'
import { showDeletionToast } from '../deletion/showDeletionToast'
import { deleteElement } from './deleteElement'

/** Nimmt ein Element sofort aus dem Set – und damit von allen Karten. Der Toast
    bietet an, es an seine alte Stelle in der Stapelreihenfolge zurückzusetzen. */
export function deleteElementWithUndo(cardSet: CardSet, elementId: string) {
  const elementIndex = cardSet.elements.findIndex((element) => element.id === elementId)
  if (elementIndex === -1) return
  const [deletedElement] = cardSet.elements.splice(elementIndex, 1)

  showDeletionToast(
    dictionary.cardEditor.textElementDeleted,
    () => cardSet.elements.splice(elementIndex, 0, deletedElement),
    () => deleteElement(cardSet, deletedElement),
  )
}
