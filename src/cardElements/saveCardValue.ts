import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { cardSets, type Card } from '../cardSets/cardSets'
import { reloadCardSet } from '../cardSets/loadCardSets'

/** Schickt einen Wert der Karte (Text, Bild) ins Backend und übernimmt danach
 *  ihre neue Version. send schickt ihn ab, ohne Wert liefert es undefined. Die
 *  Karte wird erst jetzt gesucht: Wurde ihr Set inzwischen neu geladen, ist sie
 *  ein neues Objekt. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. Aufrufen über queueCardChange. */
export async function saveCardValue(
  cardId: string,
  send: (card: Card) => Promise<unknown> | undefined,
) {
  const cardSet = cardSets.value?.find((cardSet) => cardSet.cards.some((card) => card.id === cardId))
  const card = cardSet?.cards.find((card) => card.id === cardId)
  const sending = card && send(card)
  if (!cardSet || !card || !sending) return false

  try {
    await sending
    // Um wie viel die Version gestiegen ist, sagt die Antwort nicht – darum nachladen.
    card.version = (await postOffice.cards.loadCard(cardId)).version
    return true
  } catch (error) {
    // Jemand anderes hat die Karte oder das Element inzwischen geändert oder gelöscht.
    if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    return false
  }
}
