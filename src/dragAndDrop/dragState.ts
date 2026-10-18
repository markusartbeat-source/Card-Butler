import { computed, ref, watch } from 'vue'
import { hoveredDropField, type DragKind } from './dropField'

/** Was gerade gezogen wird – sonst null. Geteilt, damit der Rest der
    Oberfläche zurücktritt, solange es dauert, auch während der Animation eines
    Felds nach dem Loslassen. */
export const draggedKind = ref<DragKind | null>(null)

export const isDragging = computed(() => draggedKind.value !== null)

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

/** Über welchem Feld losgelassen wurde – null, wenn einfach einsortiert –,
    dazu wo das Gezogene stand und welches Element es ist, damit ein Feld noch
    damit animieren kann. Der Zieh-Zustand bleibt, bis der Aufrufer ihn mit
    releaseDrag freigibt. */
export function endDrag() {
  return { droppedOn: hoveredDropField.value, index: draggedFromIndex, element: draggedElement }
}

/** Gibt die Oberfläche zurück: Die Leiste fährt weg, alles wird wieder hell.
    Ein beendetes Ziehen löst danach noch einen Klick auf die Kachel aus, darum
    bleibt der Zustand bis nach diesem Klick bestehen. */
export function releaseDrag() {
  hoveredDropField.value = null
  draggedElement = null
  elementAfterDragged = null
  setTimeout(() => {
    draggedKind.value = null
  }, 0)
}

// Über der Leiste gehört das Gezogene nirgends mehr in die Reihe. Die Reihe
// zeigt aber noch den letzten Platz auf dem Weg nach oben, darum kommt die
// Lücke zurück an den Ursprung – Ablegen auf einem Feld lässt die Reihenfolge
// dann unverändert. Nur das Gezogene wandert in der Reihe, sein ursprünglicher
// Nachfolger steht also noch da.
watch(hoveredDropField, (field) => {
  if (field === null || !draggedElement) return
  draggedElement.parentElement?.insertBefore(draggedElement, elementAfterDragged)
})
