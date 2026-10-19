import { showDeletionToast } from '../deletion/showDeletionToast'
import { releaseDrag } from './dragState'
import { playShredding } from './shredding'

/** Etwas Gezogenes (Karte, Bild, Ordner), über „… löschen“ losgelassen,
    verlässt seine Liste sofort und wird im Feld geschreddert. Erst wenn die
    Schnipsel fallen, kommt die Oberfläche zurück und der Toast bietet an, es an
    seinen alten Platz zu setzen. Gelöscht wird im Backend erst, wenn der Toast
    ohne „Rückgängig“ verschwunden ist. Die Liste ist die von jetzt: Wird
    inzwischen eine andere geladen, landet ein „Rückgängig“ nicht dort. */
export async function deleteDroppedItem<Item>(
  items: Item[],
  index: number,
  element: HTMLElement | null,
  deletedMessage: string,
  deleteInBackend: (item: Item) => unknown,
) {
  const [deletedItem] = items.splice(index, 1)
  if (!deletedItem) return releaseDrag()

  await playShredding(element)
  releaseDrag()

  showDeletionToast(
    deletedMessage,
    () => items.splice(index, 0, deletedItem),
    () => deleteInBackend(deletedItem),
  )
}
