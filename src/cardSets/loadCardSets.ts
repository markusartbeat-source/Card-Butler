import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import { olderFirst } from '../api/postOffice/resource'
import type { CardSetResource } from '../api/cardSets/cardSetsApi'
import { cardSetFromFullCardSet, cardSets } from './cardSets'

// TEMPORÄR: Rohdaten der Kartensets für den JSON-Kasten auf der Projektseite.
export const loadedCardSetResources = ref<CardSetResource[] | null>(null)

/** Lädt die Kartensets eines Projekts samt Karten, das älteste Set zuerst.
 *  Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function loadCardSets(projectId: string) {
  try {
    const cardSetResources = (await postOffice.cardSets.loadCardSets(projectId)).sort(olderFirst)
    loadedCardSetResources.value = cardSetResources // TEMPORÄR

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
