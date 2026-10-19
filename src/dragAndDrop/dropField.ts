import { ref, watch } from 'vue'

/** Die Felder der Drop-Leiste je Art des Gezogenen, in Reihenfolge der Leiste. */
export const dropFieldsByKind = {
  card: ['deleteCard', 'flipAllCards'],
  image: ['deleteImage', 'moveIntoNewFolder'],
  folder: ['deleteFolder', 'moveIntoNewFolder'],
} as const

export type DragKind = keyof typeof dropFieldsByKind

export type DropField = (typeof dropFieldsByKind)[DragKind][number]

/** Das Feld, über dem das Gezogene gerade hängt – sonst null. */
export const hoveredDropField = ref<DropField | null>(null)

// Die gezogene Kopie legt die Zieh-Bibliothek selbst an, Vue erreicht sie
// nicht. Nur eine Klasse weiter oben kommt an, damit sie über einem Feld
// schrumpft.
watch(hoveredDropField, (field) => {
  document.body.classList.toggle('cb-over-drop-field', field !== null)
})
