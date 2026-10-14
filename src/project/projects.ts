import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { Project } from '../api/projects/projectsApi'

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

/** Legt ein Projekt an und nimmt es in die Liste auf. Liefert, ob das geklappt
 *  hat – Fehler meldet schon die Poststelle per Toast. */
export async function createProject(name: string) {
  try {
    projects.value?.push(await postOffice.projects.createProject(name))
    return true
  } catch {
    return false
  }
}
