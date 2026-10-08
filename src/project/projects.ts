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
