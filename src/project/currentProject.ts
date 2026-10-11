import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { Project } from '../api/projects/projectsApi'
import { cardSets } from '../cardSets/cardSets'
import { loadCardSets } from '../cardSets/loadCardSets'
import { projects } from './projects'

// Das geöffnete Projekt. Header und Projektseite lesen es von hier; es bleibt
// auch auf anderen Seiten, damit das Kartenset-Menü dorthin zurückführt.
export const currentProject = ref<Project | null>(null)

/** Öffnet ein Projekt. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function openProject(projectId: string) {
  // Aus der Liste ist der Name schon bekannt, so steht er sofort im Header. Die
  // Kartensets des vorigen Projekts sollen dabei nicht aufblitzen.
  if (currentProject.value?.id !== projectId) {
    currentProject.value = projects.value?.find((project) => project.id === projectId) ?? null
    cardSets.value = null
  }

  try {
    currentProject.value = await postOffice.projects.loadProject(projectId)
  } catch {
    currentProject.value = null
    cardSets.value = null
    return false
  }

  // Erst danach: Fehlt das Projekt, käme sonst ein zweiter Fehler-Toast. Schon
  // geladene Sets bleiben, sonst ginge beim Seitenwechsel die lokale
  // Reihenfolge der Karten verloren.
  return cardSets.value !== null || loadCardSets(projectId)
}
