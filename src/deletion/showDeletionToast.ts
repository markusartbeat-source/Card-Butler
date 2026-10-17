import { dismissToast, showActionToast } from '../components/atoms/toaster'

// Je Toast, der noch steht, wie das Gelöschte zurückkommt – das neueste zuletzt.
const restoreByToastId = new Map<string, () => void>()

/** Für etwas, das lokal schon weg ist: Der Toast bietet an, es zurückzuholen.
    Erst wenn er ohne „Rückgängig“ verschwunden ist, wird es im Backend
    gelöscht. */
export function showDeletionToast(title: string, restore: () => void, deleteInBackend: () => void) {
  let isRestored = false
  // Nur einmal, auch wenn Button und Strg+Z zusammenkommen.
  const restoreOnce = () => {
    if (isRestored) return
    isRestored = true
    restore()
  }

  const toastId = showActionToast(
    title,
    { label: dictionary.general.undo, onClick: restoreOnce },
    () => {
      restoreByToastId.delete(toastId)
      if (!isRestored) deleteInBackend()
    },
  )
  restoreByToastId.set(toastId, restoreOnce)
}

/** Holt das zuletzt Gelöschte zurück, solange sein Toast noch steht – wie ein
    Klick auf „Rückgängig“. Liefert, ob es etwas zurückzuholen gab. */
export function undoLastDeletion() {
  const toastId = [...restoreByToastId.keys()].at(-1)
  if (toastId === undefined) return false

  restoreByToastId.get(toastId)?.()
  restoreByToastId.delete(toastId)
  dismissToast(toastId)
  return true
}
