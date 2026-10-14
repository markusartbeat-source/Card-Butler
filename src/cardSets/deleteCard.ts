import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import type { Card, CardSet } from './cardSets'
import { reloadCardSet } from './loadCardSets'

/** Löscht eine Karte im Backend – aus dem Set ist sie da schon raus.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function deleteCard(cardSet: CardSet, card: Card) {
  try {
    await postOffice.cards.deleteCard(card.id, card.version)
    return true
  } catch (error) {
    // Jemand anderes hat die Karte inzwischen geändert oder gelöscht.
    if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    return false
  }
}
