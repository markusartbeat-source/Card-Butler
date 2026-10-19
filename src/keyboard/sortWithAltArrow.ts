import { nextTick } from 'vue'

const stepByKey: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }

/** Für aria-keyshortcuts an allem, was sich so sortieren lässt. */
export const sortingKeyShortcuts = 'Alt+ArrowLeft Alt+ArrowRight'

/** Alt+←/→ auf einer Kachel verschiebt ihren Eintrag um eine Stelle in der
    Liste – Ersatz für das Ziehen. Beim Umstellen kann der Browser den Fokus
    verlieren, darum bekommt die Kachel ihn danach zurück. */
export async function sortWithAltArrow<Item>(event: KeyboardEvent, items: Item[], item: Item) {
  const step = stepByKey[event.key]
  if (!event.altKey || !step) return
  // Sonst blättert Alt+← im Browser eine Seite zurück.
  event.preventDefault()
  const tile = event.currentTarget as HTMLElement
  const index = items.indexOf(item)
  const newIndex = Math.min(Math.max(index + step, 0), items.length - 1)
  items.splice(index, 1)
  items.splice(newIndex, 0, item)
  await nextTick()
  tile.focus()
}
