import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { queueCardChange } from './cardChangeQueue'
import type { Card, CardSet } from './cardSets'
import { reloadCardSet } from './loadCardSets'
import { reloadCardVersionsAndPositions } from './reloadCardVersionsAndPositions'

/** Löscht eine Karte im Backend – aus dem Set ist sie da schon raus. Die Karten
 *  dahinter rücken im Backend nach, darum werden danach Versionen und Plätze
 *  nachgeladen. Läuft hinter allen Änderungen an Karten des Sets.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export function deleteCard(cardSet: CardSet, card: Card) {
  return queueCardChange([card.id, ...cardSet.cards.map(({ id }) => id)], async () => {
    try {
      // Wurde verschoben oder angelegt, solange „Rückgängig“ stand, ist die
      // Karte im Backend mitgerückt – ihre neue Version kam hier nie an, sie
      // steht ja nicht mehr im Set. Darum gilt ihr aktueller Stand.
      const { version } = await postOffice.cards.loadCard(card.id)
      await postOffice.cards.deleteCard(card.id, version)
    } catch (error) {
      // Jemand anderes hat die Karte inzwischen gelöscht oder geändert.
      if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
      return false
    }
    // Die Karte ist weg; scheitert nur das Nachladen, meldet das die Poststelle.
    await reloadCardVersionsAndPositions(cardSet).catch(() => {})
    return true
  })
}
