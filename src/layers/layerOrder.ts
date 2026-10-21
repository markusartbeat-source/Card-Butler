import { refStoredInBrowser } from '../browserStorage/refStoredInBrowser'
import type { CardSet, CardSetElement } from '../cardSets/cardSets'

// Das Backend kennt keine Ebenen-Reihenfolge, die Elemente kommen nach ihrem
// Alter. Die umsortierte merkt sich deshalb der Browser – je Set die
// Element-ids, die unterste Ebene zuerst.
const layerOrders = refStoredInBrowser<Record<string, string[]>>('layerOrders', {})

/** Merkt sich die jetzige Reihenfolge der Elemente eines Sets. */
export function rememberLayerOrder(cardSet: CardSet) {
  layerOrders.value = {
    ...layerOrders.value,
    [cardSet.id]: cardSet.elements.map((element) => element.id),
  }
}

/** Ordnet die Elemente eines Sets (nach Alter) so, wie ihre Ebenen zuletzt
    sortiert waren. Neue, z.B. von jemand anderem angelegt, liegen obenauf –
    untereinander nach Alter. Gelöschte fallen einfach weg. */
export function inRememberedLayerOrder(cardSetId: string, elements: CardSetElement[]) {
  const order = layerOrders.value[cardSetId] ?? []
  const rank = (element: CardSetElement) => {
    const index = order.indexOf(element.id)
    return index < 0 ? order.length : index
  }
  return [...elements].sort((first, second) => rank(first) - rank(second))
}
