import { hoveredDropField } from './dropField'

/** How the card row hands its cards to the drag library. The two classes live
    in style.css, because they have to sit in the same layer as the card
    animation they switch off. */
export const cardDragOptions = {
  // The mouse can still be down in the row while the card already hangs over
  // the drop bar. Then the card belongs to the bar, and the row must not sort:
  // returning false takes every move away from the library.
  onMove: () => hoveredDropField.value === null,
  animation: 200,
  draggable: '.cb-card',
  forceFallback: true,
  fallbackTolerance: 8,
  ghostClass: 'cb-card-ghost',
  dragClass: 'cb-card-dragged',
}
