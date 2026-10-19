import { isOverDropTarget } from './dragState'
import { sortingEdgeShare } from './pageDropTarget'

/** Wie eine Reihe ihre Kacheln an die Zieh-Bibliothek gibt – für Karten wie
    Bilder. Welche Kacheln ziehbar sind, sagt die Reihe selbst („draggable“).
    Die beiden Klassen stehen in style.css. */
export const dragOptions = {
  // Die Maus kann noch über der Reihe sein, während das Gezogene schon über der
  // Drop-Leiste hängt. Dann gehört es der Leiste und die Reihe sortiert nicht:
  // false nimmt der Bibliothek jede Bewegung weg. Ebenso über einem Ziel in der
  // Seite, z.B. einem Ordner.
  onMove: () => !isOverDropTarget.value,
  animation: 200,
  forceFallback: true,
  fallbackTolerance: 8,
  ghostClass: 'cb-drag-ghost',
  dragClass: 'cb-dragged',
}

/** Für eine Reihe, deren Kacheln selbst Ziele sind (z.B. Ordner): Sortiert wird
    nur über den Rändern einer Kachel, ihre Mitte nimmt das Gezogene auf (siehe
    pageDropTargetAt). Die Bibliothek zählt beide Ränder zusammen. */
export const edgeSortingDragOptions = {
  ...dragOptions,
  invertSwap: true,
  invertedSwapThreshold: 2 * sortingEdgeShare,
}
