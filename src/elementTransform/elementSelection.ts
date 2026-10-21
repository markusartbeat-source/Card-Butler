import { ref } from 'vue'

// Which card element the user is working on right now. Only one at a time, and
// only meaningful inside the card editor — the editor clears it on open and
// close, so a click somewhere else can never leave a stale selection behind.
export const selectedElementId = ref<string | null>(null)

// Das ausgewählte Element auf der offenen Karte (nicht in der Übersicht). Die
// Anfasser suchen es heraus – wer seine sichtbare Größe braucht, misst es hier.
export const selectedElementNode = ref<HTMLElement | null>(null)

// Ob das ausgewählte Element gerade bearbeitet wird – die 2. Stufe der Auswahl:
// Tippen beim Text, Ausschnitt anpassen beim Bild. Jede neue Auswahl beendet sie.
export const isEditingSelectedElement = ref(false)

export function selectElement(id: string) {
  selectedElementId.value = id
  isEditingSelectedElement.value = false
}

export function startEditingElement(id: string) {
  selectedElementId.value = id
  isEditingSelectedElement.value = true
}

export function clearElementSelection() {
  selectedElementId.value = null
  isEditingSelectedElement.value = false
}

// Eine Stufe zurück: bearbeiten → ausgewählt → nichts. false, wenn schon nichts
// mehr ausgewählt war.
export function stepBackElementSelection() {
  if (isEditingSelectedElement.value) isEditingSelectedElement.value = false
  else if (selectedElementId.value) selectedElementId.value = null
  else return false
  return true
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
