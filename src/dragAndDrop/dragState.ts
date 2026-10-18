import { computed, ref, watch } from 'vue'
import { hoveredDropField, type DragKind } from './dropField'
import { hoveredPageDropTarget } from './pageDropTarget'

/** Was gerade gezogen wird – sonst null. Geteilt, damit der Rest der
    Oberfläche zurücktritt, solange es dauert, auch während der Animation eines
    Felds nach dem Loslassen. */
export const draggedKind = ref<DragKind | null>(null)

export const isDragging = computed(() => draggedKind.value !== null)

/** Ob das Gezogene über einem Feld der Leiste oder einem Ziel in der Seite
    hängt – dann gehört es dorthin und keine Reihe sortiert. */
export const isOverDropTarget = computed(
  () => hoveredDropField.value !== null || hoveredPageDropTarget.value !== null,
)

// Woher das Gezogene kam, damit die Reihe wieder so hergestellt werden kann.
let draggedElement: HTMLElement | null = null
let draggedFromIndex = 0
let elementAfterDragged: Element | null = null

// „oldDraggableIndex“ zählt nur ziehbare Kacheln, „oldIndex“ auch die Kachel
// davor (z.B. „Neue Karte“) – der wäre um eins verschoben.
export function startDrag(kind: DragKind, event: { item: HTMLElement; oldDraggableIndex?: number }) {
  draggedElement = event.item
  draggedFromIndex = event.oldDraggableIndex ?? 0
  elementAfterDragged = event.item.nextElementSibling
  draggedKind.value = kind
}

/** Über welchem Feld bzw. welchem Ziel in der Seite (z.B. Ordner) losgelassen
    wurde – beides null, wenn einfach einsortiert –, dazu wo das Gezogene stand
    und welches Element es ist, damit ein Ziel noch damit animieren kann. Der
    Zieh-Zustand bleibt, bis der Aufrufer ihn mit releaseDrag freigibt. */
export function endDrag() {
  return {
    droppedOn: hoveredDropField.value,
    droppedInto: hoveredPageDropTarget.value,
    index: draggedFromIndex,
    element: draggedElement,
  }
}

/** Gibt die Oberfläche zurück: Die Leiste fährt weg, alles wird wieder hell.
    Ein beendetes Ziehen löst danach noch einen Klick auf die Kachel aus, darum
    bleibt der Zustand bis nach diesem Klick bestehen. */
export function releaseDrag() {
  hoveredDropField.value = null
  hoveredPageDropTarget.value = null
  draggedElement = null
  elementAfterDragged = null
  setTimeout(() => {
    draggedKind.value = null
  }, 0)
}

// Über der Leiste oder einem Ziel in der Seite gehört das Gezogene nirgends
// mehr in die Reihe. Die Reihe zeigt aber noch den letzten Platz auf dem Weg
// dorthin, darum kommt die Lücke zurück an den Ursprung – Ablegen auf dem Ziel
// lässt die Reihenfolge dann unverändert. Nur das Gezogene wandert in der
// Reihe, sein ursprünglicher Nachfolger steht also noch da.
watch(isOverDropTarget, (isOver) => {
  if (!isOver || !draggedElement) return
  draggedElement.parentElement?.insertBefore(draggedElement, elementAfterDragged)
})
