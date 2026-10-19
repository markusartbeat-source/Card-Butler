import { deleteWithUndo } from '../deletion/deleteWithUndo'
import { releaseDrag } from './dragState'
import { playShredding } from './shredding'

/** Etwas Gezogenes (Karte, Bild, Ordner), über „… löschen“ losgelassen,
    verlässt seine Liste sofort und wird im Feld geschreddert. Erst wenn die
    Schnipsel fallen, kommt die Oberfläche zurück und der Toast bietet
    „Rückgängig“ an (siehe deleteWithUndo). */
export async function deleteDroppedItem<Item>(
  items: Item[],
  index: number,
  element: HTMLElement | null,
  deletedMessage: string,
  deleteInBackend: (item: Item) => unknown,
) {
  const item = items[index]
  if (item !== undefined) {
    await deleteWithUndo(items, item, deletedMessage, deleteInBackend, () => playShredding(element))
  }
  releaseDrag()
}
