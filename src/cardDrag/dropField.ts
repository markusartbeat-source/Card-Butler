import { ref, watch } from 'vue'

/** The fields of the drop bar, in bar order. */
export const dropFields = ['deleteCard', 'flipAllCards'] as const

export type DropField = (typeof dropFields)[number]

/** The field the dragged card hangs over right now — null anywhere else. */
export const hoveredDropField = ref<DropField | null>(null)

// The dragged card is a copy the drag library puts into <body>, outside the
// app — only a class up there reaches it, so it can shrink over a field.
watch(hoveredDropField, (field) => {
  document.body.classList.toggle('cb-over-drop-field', field !== null)
})
