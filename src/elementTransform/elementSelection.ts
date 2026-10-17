import { ref } from 'vue'

// Which card element the user is working on right now. Only one at a time, and
// only meaningful inside the card editor — the editor clears it on open and
// close, so a click somewhere else can never leave a stale selection behind.
export const selectedElementId = ref<string | null>(null)

// Ob im ausgewählten Feld gerade getippt wird (Tippmodus). Jede neue Auswahl
// beendet ihn.
export const isTypingInSelectedElement = ref(false)

export function selectElement(id: string) {
  selectedElementId.value = id
  isTypingInSelectedElement.value = false
}

export function startTypingInSelectedElement() {
  isTypingInSelectedElement.value = true
}

export function clearElementSelection() {
  selectedElementId.value = null
  isTypingInSelectedElement.value = false
}

// Für einen Druck auf die Karte, der kein Element traf – beim Drücken, nicht
// beim Klick: Wer Text über den Feldrand hinaus markiert, ließe den Klick sonst
// daneben landen und beendete das Tippen.
// The element's own click does not stop bubbling, because in the grid that same
// click has to reach the card and open the editor. The handles sit inside the
// card as well, so a press on them must not count as a miss either.
export function clearSelectionOnMiss(event: MouseEvent) {
  const hit = (event.target as HTMLElement).closest('[data-element-id], .moveable-control-box')
  if (!hit) clearElementSelection()
}
