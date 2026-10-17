/** Ob die Taste in einem Eingabefeld gedrückt wurde. Dort gehören Tasten wie
    Entf oder Strg+Z dem Feld selbst. */
export function isInInputField(event: KeyboardEvent) {
  return !!(event.target as HTMLElement).closest('input, textarea, [contenteditable]')
}
