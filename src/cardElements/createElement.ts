import type { ElementData } from '../api/elements/elementsApi'
import { postOffice } from '../api/postOffice/postOffice'
import type { CardSet } from '../cardSets/cardSets'

/** Legt im Set ein Element an. Liefert die Antwort des Backends oder null –
 *  Fehler meldet schon die Poststelle per Toast. */
export async function createElement(cardSet: CardSet, data: ElementData) {
  try {
    return await postOffice.elements.createElement(cardSet.id, data)
  } catch {
    return null
  }
}
