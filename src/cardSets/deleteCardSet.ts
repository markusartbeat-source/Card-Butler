import { postOffice } from '../api/postOffice/postOffice'
import type { CardSet } from './cardSets'

/** Löscht ein Kartenset samt Karten im Backend – aus der Liste ist es da schon
 *  raus. Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per
 *  Toast. */
export async function deleteCardSet(cardSet: CardSet) {
  try {
    // Jede Änderung an Karten und Elementen erhöht die Version des Sets, auch
    // solange „Rückgängig“ stand – darum gilt sein aktueller Stand.
    const { version } = await postOffice.cardSets.loadCardSet(cardSet.id)
    await postOffice.cardSets.deleteCardSet(cardSet.id, version)
    return true
  } catch {
    return false
  }
}
