import { showDeletionToast } from './showDeletionToast'

/** Nimmt einen Eintrag (Karte, Bild, Ordner) sofort aus seiner Liste. Der Toast
    bietet an, ihn an seinen alten Platz zu setzen. Gelöscht wird im Backend
    erst, wenn der Toast ohne „Rückgängig“ verschwunden ist. Die Liste ist die
    von jetzt: Wird inzwischen eine andere geladen, landet ein „Rückgängig“ nicht
    dort. Bevor der Toast kommt, kann noch etwas ablaufen, z.B. eine Animation. */
export async function deleteWithUndo<Item>(
  items: Item[],
  item: Item,
  deletedMessage: string,
  deleteInBackend: (item: Item) => unknown,
  beforeToast: () => Promise<unknown> = async () => {},
) {
  const index = items.indexOf(item)
  if (index < 0) return
  items.splice(index, 1)

  await beforeToast()

  showDeletionToast(
    deletedMessage,
    () => items.splice(index, 0, item),
    () => deleteInBackend(item),
  )
}
