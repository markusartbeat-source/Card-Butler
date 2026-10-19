import { computed } from 'vue'
import { draggedKind, isDragging } from './dragState'
import type { DragKind } from './dropField'

// Reines CSS – nur die Klasse wird gesetzt, nichts von Hand animiert.
function dimClasses(isDimmed: boolean) {
  return ['transition-opacity duration-300', isDimmed ? 'opacity-20' : '']
}

/** Alles, was beim Ziehen zurücktritt, trägt diese Klassen. */
export const dimWhileDraggingClasses = computed(() => dimClasses(isDragging.value))

/** Tritt nur zurück, wenn etwas anderer Art gezogen wird – z.B. bleiben die
    Bilder hell, solange ein Bild zwischen sie einsortiert wird. */
export function dimWhileDraggingOtherThan(kind: DragKind) {
  return dimClasses(isDragging.value && draggedKind.value !== kind)
}
