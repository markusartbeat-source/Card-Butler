import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { Project } from '../api/projects/projectsApi'
import { cardSets } from '../cardSets/cardSets'
import { createCardSet } from '../cardSets/createCardSet'
import { loadCardSets } from '../cardSets/loadCardSets'
import { projectFolders } from '../folders/projectFolders'
import { projectImages } from '../images/projectImages'
import { projects } from './projects'

// Das geöffnete Projekt. Header und Projektseite lesen es von hier; es bleibt
// auch auf anderen Seiten, damit das Kartenset-Menü dorthin zurückführt.
export const currentProject = ref<Project | null>(null)

/** Öffnet ein Projekt. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function openProject(projectId: string) {
  // Aus der Liste ist der Name schon bekannt, so steht er sofort im Header. Die
  // Kartensets, Bilder und Ordner des vorigen Projekts sollen dabei nicht
  // aufblitzen.
  if (currentProject.value?.id !== projectId) {
    currentProject.value = projects.value?.find((project) => project.id === projectId) ?? null
    cardSets.value = null
    projectImages.value = null
    projectFolders.value = null
  }

  try {
    currentProject.value = await postOffice.projects.loadProject(projectId)
  } catch {
    closeProject()
    return false
  }

  // Erst danach: Fehlt das Projekt, käme sonst ein zweiter Fehler-Toast. Schon
  // geladene Sets bleiben, sonst ginge beim Seitenwechsel die lokale
  // Reihenfolge der Karten verloren.
  if (cardSets.value === null && !(await loadCardSets(projectId))) {
    closeProject()
    return false
  }

  // Ein Projekt ohne Kartenset bekommt gleich eins mit einer Karte – so steht
  // der „Neue Karte“-Button immer bereit. Klappt das nicht, bleibt das Projekt
  // trotzdem offen.
  if (cardSets.value?.length === 0) await createCardSet(projectId)
  return true
}

// Ganz zu, damit der Projekt-Rahmen es beim nächsten Mal neu lädt statt ein
// halb geöffnetes Projekt für offen zu halten.
function closeProject() {
  currentProject.value = null
  cardSets.value = null
  projectImages.value = null
  projectFolders.value = null
}
