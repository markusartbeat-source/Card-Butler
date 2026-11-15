import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { queueCardChange } from './cardChangeQueue'
import type { Card, CardSet } from './cardSets'
import { reloadCardSet } from './loadCardSets'
import { reloadCardVersionsAndPositions } from './reloadCardVersionsAndPositions'

/** Der Platz im Backend direkt hinter dem neuen Vorgänger – ohne Vorgänger ganz
 *  vorn. So stimmt er auch, wenn das Backend noch Karten kennt, die hier schon
 *  fehlen (gelöscht, Rückgängig noch möglich). Rückt die Karte nach hinten,
 *  rückt der Vorgänger beim Herausnehmen um eins vor. */
function positionBehind(previousCard: Card | undefined, card: Card) {
  if (!previousCard) return 0
  return previousCard.position < card.position ? previousCard.position + 1 : previousCard.position
}

/** Speichert den neuen Platz einer gezogenen Karte – im Set steht sie da schon.
 *  Die anderen rücken im Backend nach, darum werden danach alle Versionen und
 *  Plätze nachgeladen. Läuft hinter allen Änderungen an Karten des Sets; die
 *  Karte wird erst dann gesucht. Fehler meldet schon die Poststelle per Toast. */
export function moveCard(cardSet: CardSet, cardId: string) {
  return queueCardChange(
    cardSet.cards.map((card) => card.id),
    async () => {
      const index = cardSet.cards.findIndex((card) => card.id === cardId)
      const card = cardSet.cards[index]
      if (!card) return

      const position = positionBehind(cardSet.cards[index - 1], card)
      if (position === card.position) return

      try {
        await postOffice.cards.updateCard(cardId, { position }, card.version)
        await reloadCardVersionsAndPositions(cardSet)
      } catch (error) {
        // Jemand anderes hat eine Karte des Sets inzwischen geändert oder gelöscht.
        if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
      }
    },
  )
}
