import type { ElementData } from '../api/elements/elementsApi'
import { postOffice } from '../api/postOffice/postOffice'
import { cardSetElementFromResource, type CardSet } from '../cardSets/cardSets'

/** Legt im Set ein Element an und hängt es hinten an, also obenauf. Liefert die
 *  Antwort des Backends oder null – Fehler meldet schon die Poststelle per Toast. */
export async function createElement(cardSet: CardSet, data: ElementData) {
  try {
    const elementResource = await postOffice.elements.createElement(cardSet.id, data)
    cardSet.elements.push(cardSetElementFromResource(elementResource))
    return elementResource
  } catch {
    return null
  }
}
