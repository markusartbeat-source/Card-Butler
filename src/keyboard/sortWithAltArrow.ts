import { nextTick } from 'vue'
import { announce } from '../components/atoms/CbAnnouncer.vue'

const stepByKey: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }

/** Für aria-keyshortcuts an allem, was sich so sortieren lässt. */
export const sortingKeyShortcuts = 'Alt+ArrowLeft Alt+ArrowRight'

/** Alt+←/→ auf einer Kachel verschiebt ihren Eintrag um eine Stelle in der
    Liste – Ersatz für das Ziehen. Die Ansage nennt den neuen Platz (am Rand den
    alten). Beim Umstellen kann der Browser den Fokus verlieren, darum bekommt
    die Kachel ihn danach zurück. */
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
  announce(dictionary.general.positionOf(newIndex + 1, items.length))
  await nextTick()
  tile.focus()
}
