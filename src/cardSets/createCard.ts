import { postOffice } from '../api/postOffice/postOffice'
import { queueCardChange } from './cardChangeQueue'
import { cardFromResource, type CardSet } from './cardSets'
import { reloadCardVersionsAndPositions } from './reloadCardVersionsAndPositions'

/** Legt vorn im Set eine Karte an – dort steht der „Neue Karte“-Button. Die
 *  anderen rücken im Backend nach, darum werden danach ihre Versionen und Plätze
 *  nachgeladen. Läuft hinter allen Änderungen an Karten des Sets.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export function createCard(cardSet: CardSet) {
  return queueCardChange(
    cardSet.cards.map((card) => card.id),
    async () => {
      try {
        const cardResource = await postOffice.cards.createCard(cardSet.id, { position: 0 })
        cardSet.cards.unshift(cardFromResource(cardResource))
      } catch {
        return false
      }
      // Die Karte gibt es jetzt; scheitert nur das Nachladen, meldet das die Poststelle.
      await reloadCardVersionsAndPositions(cardSet).catch(() => {})
      return true
    },
  )
}
