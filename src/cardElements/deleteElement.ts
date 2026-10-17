import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { queueCardChange } from '../cardSets/cardChangeQueue'
import type { Card, CardSet, CardSetElement } from '../cardSets/cardSets'
import { reloadCardSet } from '../cardSets/loadCardSets'

/** Löscht ein Element im Backend – aus dem Set ist es da schon raus. Das Backend
 *  löscht dabei auch die Werte der Karten zu diesem Element, deren Versionen
 *  steigen dadurch. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. */
export function deleteElement(cardSet: CardSet, element: CardSetElement) {
  const hasValue = (card: Card) => element.id in card.elementValues
  const cardIdsWithValue = cardSet.cards.filter(hasValue).map((card) => card.id)

  // Laufende Speicherungen dieser Karten erst abwarten, spätere warten hierauf.
  return queueCardChange(cardIdsWithValue, async () => {
    try {
      await postOffice.elements.deleteElement(element.id, element.version)
      // Die Karten erst jetzt suchen: Wurde das Set inzwischen neu geladen, sind
      // es neue Objekte.
      await Promise.all(
        cardSet.cards.filter(hasValue).map(async (card) => {
          delete card.elementValues[element.id]
          // Um wie viel die Version gestiegen ist, sagt die Antwort nicht – darum nachladen.
          card.version = (await postOffice.cards.loadCard(card.id)).version
        }),
      )
      return true
    } catch (error) {
      // Jemand anderes hat das Element oder eine Karte inzwischen geändert oder gelöscht.
      if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
      return false
    }
  })
}
