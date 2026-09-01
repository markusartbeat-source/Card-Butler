import { ref } from 'vue'

// Which card element the user is working on right now. Only one at a time, and
// only meaningful inside the card editor — the editor clears it on open and
// close, so a click somewhere else can never leave a stale selection behind.
export const selectedElementId = ref<string | null>(null)

export function selectElement(id: string) {
  selectedElementId.value = id
}

export function clearElementSelection() {
  selectedElementId.value = null
}

// For a click on the card that missed every element. The element's own click
// does not stop bubbling, because in the grid that same click has to reach the
// card and open the editor. The handles sit inside the card as well, so a click
// on them must not count as a miss either.
export function clearSelectionOnMiss(event: MouseEvent) {
  const hit = (event.target as HTMLElement).closest('[data-element-id], .moveable-control-box')
  if (!hit) clearElementSelection()
}
