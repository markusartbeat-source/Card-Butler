import { ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { Project } from '../api/projects/projectsApi'
import { projects } from './projects'

// Das geöffnete Projekt. Header und Projektseite lesen es von hier; es bleibt
// auch auf anderen Seiten, damit das Kartenset-Menü dorthin zurückführt.
export const currentProject = ref<Project | null>(null)

/** Öffnet ein Projekt. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function openProject(projectId: string) {
  // Aus der Liste ist der Name schon bekannt, so steht er sofort im Header.
  if (currentProject.value?.id !== projectId) {
    currentProject.value = projects.value?.find((project) => project.id === projectId) ?? null
  }

  try {
    currentProject.value = await postOffice.projects.loadProject(projectId)
    return true
  } catch {
    currentProject.value = null
    return false
  }
}
