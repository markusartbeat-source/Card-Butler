import { ref, watch } from 'vue'

/** Das Ziel in der Seite (nicht in der Drop-Leiste), auf dem der Mauszeiger
    beim Ziehen gerade steht, z.B. ein Ordner – sonst null. Der Wert ist der des
    Ziels, was er bedeutet, weiß die Seite. */
export const hoveredPageDropTarget = ref<string | null>(null)

/** Macht ein Element per v-bind zum Ziel in der Seite. Steht der Mauszeiger
    beim Ziehen darauf, trägt es data-drop-hovered und leuchtet (siehe
    .cb-hover in style.css). */
export function pageDropTargetAttributes(value: string) {
  return {
    'data-drop-target': value,
    'data-drop-hovered': hoveredPageDropTarget.value === value || undefined,
  }
}

/** Das Ziel unter einem Punkt, z.B. dem Mauszeiger. Die gezogene Kopie lässt
    die Maus durch, sie steht also nicht im Weg. */
export function pageDropTargetAt(x: number, y: number) {
  const target = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drop-target]')
  return target?.dataset.dropTarget ?? null
}

// Wie beim Feld der Leiste: Die gezogene Kopie erreicht nur eine Klasse weiter
// oben, damit sie über dem Ziel schrumpft.
watch(hoveredPageDropTarget, (target) => {
  document.body.classList.toggle('cb-over-page-drop-target', target !== null)
})
