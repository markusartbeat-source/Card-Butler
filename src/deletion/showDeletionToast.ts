import { showActionToast } from '../components/atoms/toaster'

/** Für etwas, das lokal schon weg ist: Der Toast bietet an, es zurückzuholen.
    Erst wenn er ohne „Rückgängig“ verschwunden ist, wird es im Backend
    gelöscht. */
export function showDeletionToast(title: string, restore: () => void, deleteInBackend: () => void) {
  let isRestored = false
  showActionToast(
    title,
    {
      label: dictionary.general.undo,
      onClick: () => {
        isRestored = true
        restore()
      },
    },
    () => {
      if (!isRestored) deleteInBackend()
    },
  )
}
