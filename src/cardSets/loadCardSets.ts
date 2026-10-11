import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import { olderFirst } from '../api/postOffice/resource'
import type { CardSetResource } from '../api/cardSets/cardSetsApi'
import { cardSets } from './cardSets'

// TEMPORÄR: Rohdaten der Kartensets für den JSON-Kasten auf der Projektseite.
export const loadedCardSetResources = ref<CardSetResource[] | null>(null)

/** Lädt die Kartensets eines Projekts, das älteste zuerst. Karten kommen
 *  später dazu. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function loadCardSets(projectId: string) {
  try {
    const cardSetResources = await postOffice.cardSets.loadCardSets(projectId)
    loadedCardSetResources.value = cardSetResources
    cardSets.value = cardSetResources
      .sort(olderFirst)
      .map((cardSetResource) => ({
        id: cardSetResource.id,
        name: cardSetResource.data.name,
        cards: [],
      }))
    return true
  } catch {
    return false
  }
}
