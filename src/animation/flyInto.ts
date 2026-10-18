/** Lässt ein Element in die Mitte eines Ziels fliegen und dabei auf nichts
 *  schrumpfen, z.B. in ein Feld der Drop-Leiste oder in einen Ordner. Danach
 *  bleibt es unsichtbar, bis der Aufrufer es wegnimmt. */
export function flyInto(element: HTMLElement, into: DOMRect, durationInMilliseconds: number) {
  const from = element.getBoundingClientRect()
  const moveX = into.left + into.width / 2 - (from.left + from.width / 2)
  const moveY = into.top + into.height / 2 - (from.top + from.height / 2)

  // „translate“ und „scale“ statt „transform“ – wie überall, wo in diesem
  // Projekt etwas bewegt wird.
  const flight = element.animate(
    [
      { translate: '0 0', scale: 1 },
      { translate: `${moveX}px ${moveY}px`, scale: 0 },
    ],
    { duration: durationInMilliseconds, easing: 'ease-in', fill: 'forwards' },
  )
  return flight.finished
}
