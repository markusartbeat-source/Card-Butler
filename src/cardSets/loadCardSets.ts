import { postOffice } from '../api/postOffice/postOffice'
import { olderFirst } from '../api/postOffice/resource'
import { cardSetFromFullCardSet, cardSets, type CardSet } from './cardSets'

/** Lädt die Kartensets eines Projekts samt Karten, das älteste Set zuerst.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function loadCardSets(projectId: string) {
  try {
    const cardSetResources = (await postOffice.cardSets.loadCardSets(projectId)).sort(olderFirst)

    // Die Sets erscheinen erst, wenn alle Karten da sind – so fliegen sie
    // gemeinsam ein.
    const fullCardSets = await Promise.all(
      cardSetResources.map((cardSetResource) =>
        postOffice.cardSets.loadFullCardSet(cardSetResource.id),
      ),
    )
    cardSets.value = fullCardSets.map(cardSetFromFullCardSet)
    return true
  } catch {
    return false
  }
}

/** Holt ein Kartenset samt Karten neu vom Backend, z.B. wenn jemand anderes es
 *  inzwischen geändert hat. Lokale Reihenfolge und Druckanzahl gehen dabei
 *  verloren. Liefert, ob das geklappt hat. */
export async function reloadCardSet(cardSet: CardSet) {
  try {
    const fullCardSet = await postOffice.cardSets.loadFullCardSet(cardSet.id)
    Object.assign(cardSet, cardSetFromFullCardSet(fullCardSet))
    return true
  } catch {
    return false
  }
}
