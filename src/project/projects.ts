import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { Project } from '../api/projects/projectsApi'
import { createCardSetInBackend } from '../cardSets/createCardSet'

// Die Projekte der angemeldeten Person. null, solange sie nicht geladen sind –
// so blitzt vorher kein „Noch keine Projekte“ auf.
export const projects = ref<Project[] | null>(null)

/** Lädt die Projekte neu. Fehler meldet schon die Poststelle per Toast, die
 *  Liste bleibt dann, wie sie war. */
export async function loadProjects() {
  try {
    projects.value = await postOffice.projects.loadProjects()
  } catch {
    // Bereits gemeldet.
  }
}

/** Legt ein Projekt mit Kartenset 1 und Karte 1 an und nimmt es in die Liste
 *  auf. Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per
 *  Toast. */
export async function createProject(name: string) {
  try {
    const project = await postOffice.projects.createProject(name)
    // Jede Änderung im Projekt erhöht im Backend dessen Version – daher danach
    // frisch laden, sonst scheitert das erste Umbenennen.
    await createCardSetInBackend(project.id, 1)
    projects.value?.push(await postOffice.projects.loadProject(project.id))
    return true
  } catch {
    return false
  }
}
