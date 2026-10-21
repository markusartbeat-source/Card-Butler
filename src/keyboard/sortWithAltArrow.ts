import { nextTick } from 'vue'

const stepByKey: Record<string, number> = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }

/** Für aria-keyshortcuts an allem, was sich so sortieren lässt. */
export const sortingKeyShortcuts = 'Alt+ArrowLeft Alt+ArrowRight Alt+ArrowUp Alt+ArrowDown'

/** Alt+Pfeil auf einer Kachel verschiebt ihren Eintrag um eine Stelle in der
    Liste (←/↑ nach vorn, →/↓ nach hinten) – Ersatz für das Ziehen. Ist items nur
    eine Kopie, bekommt applyOrder die neue Reihenfolge. Beim Umstellen kann der
    Browser den Fokus verlieren, darum bekommt die Kachel ihn danach zurück. */
export async function sortWithAltArrow<Item>(
  event: KeyboardEvent,
  items: Item[],
  item: Item,
  applyOrder: (sortedItems: Item[]) => void = (sortedItems) => {
    items.splice(0, items.length, ...sortedItems)
  },
) {
  const step = stepByKey[event.key]
  if (!event.altKey || !step) return
  // Sonst blättert Alt+← im Browser eine Seite zurück.
  event.preventDefault()
  const tile = event.currentTarget as HTMLElement
  const index = items.indexOf(item)
  const newIndex = Math.min(Math.max(index + step, 0), items.length - 1)
  const sortedItems = [...items]
  sortedItems.splice(index, 1)
  sortedItems.splice(newIndex, 0, item)
  applyOrder(sortedItems)
  await nextTick()
  tile.focus()
}
