// Setzt den Cursor im Textfeld an die Stelle unter dem Zeiger (Bildschirm-px).
// Liegt die Stelle nicht im Feld, bleibt der Cursor, wo er ist.
export function placeCaretAtPoint(textField: HTMLElement, x: number, y: number) {
  const caret = caretAtPoint(x, y)
  if (caret && textField.contains(caret.node)) {
    window.getSelection()?.collapse(caret.node, caret.offset)
  }
}

// Ältere Browser kennen nur caretRangeFromPoint.
function caretAtPoint(x: number, y: number) {
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y)
    return position && { node: position.offsetNode, offset: position.offset }
  }
  const range = document.caretRangeFromPoint(x, y)
  return range && { node: range.startContainer, offset: range.startOffset }
}
