import { ref, watch } from 'vue'
import { showArrival } from '../animation/showArrival'
import { flyDraggedCopy } from './draggedCopyFlight'

/** Das Ziel in der Seite (nicht in der Drop-Leiste), auf dem der Mauszeiger
    beim Ziehen gerade steht, z.B. ein Ordner oder ein Eintrag im Pfad – sonst
    null. Der Wert ist der des Ziels, was er bedeutet, weiß die Seite. */
export const hoveredPageDropTarget = ref<string | null>(null)

// Über dem Ziel Losgelassenes hängt schon dort, sein Weg ist kurz.
const flightDurationInMilliseconds = 200

/** Macht ein Element per v-bind zum Ziel in der Seite. Steht der Mauszeiger
    beim Ziehen darauf, trägt es data-drop-hovered und leuchtet (z.B. per
    .cb-hover in style.css). */
export function pageDropTargetAttributes(value: string) {
  return {
    'data-drop-target': value,
    'data-drop-hovered': hoveredPageDropTarget.value === value || undefined,
  }
}

/** Anteil der Breite, den jeder Rand eines Ziels in der Reihe des Gezogenen
    dem Sortieren lässt (siehe edgeSortingDragOptions). */
export const sortingEdgeShare = 0.25

/** Das Ziel unter einem Punkt, z.B. dem Mauszeiger. Die gezogene Kopie lässt
    die Maus durch, sie steht also nicht im Weg. Steht das Ziel in derselben
    Reihe wie das Gezogene (Ordner zwischen Ordnern), zählt nur seine Mitte –
    über den Rändern wird sortiert. Der Platzhalter des Gezogenen ist kein Ziel,
    nichts lässt sich in sich selbst legen. */
export function pageDropTargetAt(x: number, y: number) {
  const target = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drop-target]')
  if (!target) return null

  const placeholder = document.querySelector('.cb-drag-ghost')
  if (placeholder?.contains(target)) return null
  if (placeholder?.parentElement?.contains(target)) {
    const rect = target.getBoundingClientRect()
    const edgeWidth = rect.width * sortingEdgeShare
    if (x < rect.left + edgeWidth || x > rect.right - edgeWidth) return null
  }
  return target.dataset.dropTarget ?? null
}

/** Lässt eine Kopie des Gezogenen von dort, wo es zuletzt hing, in das Ziel
    fliegen, über dem es losgelassen wurde. Das Element selbst steht dann noch
    an seinem alten Platz. Ohne das Ziel auf der Seite fliegt nichts. */
export async function flyDraggedIntoPageDropTarget(element: HTMLElement, value: string) {
  const target = document.querySelector<HTMLElement>(`[data-drop-target="${CSS.escape(value)}"]`)
  if (!target) return
  await flyDraggedCopy(element, target.getBoundingClientRect(), flightDurationInMilliseconds)
  showArrival(target)
}

// Wie beim Feld der Leiste: Die gezogene Kopie erreicht nur eine Klasse weiter
// oben, damit sie über dem Ziel schrumpft.
watch(hoveredPageDropTarget, (target) => {
  document.body.classList.toggle('cb-over-page-drop-target', target !== null)
})
