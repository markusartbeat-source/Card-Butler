import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { CardSetResource } from '../api/cardSets/cardSetsApi'

// TEMPORÄR: Rohdaten der Kartensets für den JSON-Kasten auf der Projektseite.
export const loadedCardSetResources = ref<CardSetResource[] | null>(null)

/** Lädt die Kartensets eines Projekts. Liefert, ob das geklappt hat – Fehler
 *  meldet schon die Poststelle per Toast. */
export async function loadCardSets(projectId: string) {
  try {
    loadedCardSetResources.value = await postOffice.cardSets.loadCardSets(projectId)
    return true
  } catch {
    return false
  }
}
