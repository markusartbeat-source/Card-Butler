/** How the card row hands its cards to the drag library. The two classes live
    in style.css, because they have to sit in the same layer as the card
    animation they switch off. */
export const cardDragOptions = {
  animation: 200,
  draggable: '.cb-card',
  forceFallback: true,
  fallbackTolerance: 8,
  ghostClass: 'cb-card-ghost',
  dragClass: 'cb-card-dragged',
}
