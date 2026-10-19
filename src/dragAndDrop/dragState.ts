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

// Das Gezogene und sein ursprünglicher Nachfolger, damit die Lücke an ihren
// Platz zurückkann.
let draggedElement: HTMLElement | null = null
let elementAfterDragged: Element | null = null

export function startDrag(kind: DragKind, event: { item: HTMLElement }) {
  draggedElement = event.item
  elementAfterDragged = event.item.nextElementSibling
  draggedKind.value = kind
}

/** Über welchem Feld bzw. welchem Ziel in der Seite (z.B. Ordner) losgelassen
    wurde – beides null, wenn einfach einsortiert –, dazu wo das Gezogene jetzt
    in seiner Liste steht und welches Element es ist, damit ein Ziel noch damit
    animieren kann. Der Zieh-Zustand bleibt, bis der Aufrufer ihn mit
    releaseDrag freigibt. */
export function endDrag(event: { newDraggableIndex?: number }) {
  return {
    droppedOn: hoveredDropField.value,
    droppedInto: hoveredPageDropTarget.value,
    // Die Bibliothek hat die Liste schon umsortiert. „newDraggableIndex“ zählt
    // nur ziehbare Kacheln, „newIndex“ auch die Kachel davor (z.B. „Neue
    // Karte“) – der wäre um eins verschoben.
    index: event.newDraggableIndex ?? 0,
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

// Über der Leiste gehört das Gezogene nirgends mehr in die Reihe. Die Reihe
// zeigt aber noch den letzten Platz auf dem Weg dorthin, darum kommt die Lücke
// zurück an den Ursprung – ein Feld, das nichts entfernt (z.B. „Alle Karten
// umdrehen“), lässt die Reihenfolge dann unverändert. Nur das Gezogene wandert
// in der Reihe, sein ursprünglicher Nachfolger steht also noch da. Über einem
// Ziel in der Seite bleibt die Lücke: Das Gezogene verlässt die Reihe ohnehin,
// und in der eigenen Reihe (Ordner auf Ordner) rückte sonst das Ziel weg.
watch(hoveredDropField, (field) => {
  if (field === null || !draggedElement) return
  draggedElement.parentElement?.insertBefore(draggedElement, elementAfterDragged)
})
