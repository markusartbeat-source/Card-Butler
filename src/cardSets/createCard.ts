import { postOffice } from '../api/postOffice/postOffice'
import { cardFromResource, type CardSet } from './cardSets'

// Das Backend verlangt für jede Karte einen Namen, die App zeigt ihn nirgends.
const placeholderCardName = 'card'

/** Legt vorn im Set eine Karte an – dort steht der „Neue Karte“-Button.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function createCard(cardSet: CardSet) {
  try {
    const cardResource = await postOffice.cards.createCard(cardSet.id, placeholderCardName)
    cardSet.cards.unshift(cardFromResource(cardResource))
    return true
  } catch {
    return false
  }
}
