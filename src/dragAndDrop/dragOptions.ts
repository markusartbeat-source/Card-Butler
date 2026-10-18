import { hoveredDropField } from './dropField'

/** Wie eine Reihe ihre Kacheln an die Zieh-Bibliothek gibt – für Karten wie
    Bilder. Welche Kacheln ziehbar sind, sagt die Reihe selbst („draggable“).
    Die beiden Klassen stehen in style.css. */
export const dragOptions = {
  // Die Maus kann noch über der Reihe sein, während das Gezogene schon über der
  // Drop-Leiste hängt. Dann gehört es der Leiste und die Reihe sortiert nicht:
  // false nimmt der Bibliothek jede Bewegung weg.
  onMove: () => hoveredDropField.value === null,
  animation: 200,
  forceFallback: true,
  fallbackTolerance: 8,
  ghostClass: 'cb-drag-ghost',
  dragClass: 'cb-dragged',
}
