import { isInInputField } from '../keyboard/isInInputField'
import { undoLastDeletion } from './showDeletionToast'

/** Strg+Z (Mac: Cmd+Z) holt das zuletzt Gelöschte zurück, solange sein Toast
    steht. In Eingabefeldern bleibt es das Rückgängig des Browsers. */
export function undoDeletionOnKey(event: KeyboardEvent) {
  const isUndoKey = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z'
  if (!isUndoKey || isInInputField(event)) return
  if (undoLastDeletion()) event.preventDefault()
}
