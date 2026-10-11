import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { currentProject } from './currentProject'
import { loadProjects, projects } from './projects'

/** Benennt ein Projekt der Liste um. Liefert, ob das geklappt hat – Fehler
 *  meldet schon die Poststelle per Toast. */
export async function renameProject(projectId: string, name: string) {
  // Die Version erst jetzt aus der Liste nehmen: Nach einem 412 ist sie neu
  // geladen, ein zweiter Versuch klappt dann.
  const project = projects.value?.find((project) => project.id === projectId)
  if (!project) return false

  try {
    const renamedProject = await postOffice.projects.renameProject(projectId, name, project.version)
    Object.assign(project, renamedProject)
    if (currentProject.value?.id === projectId) currentProject.value = renamedProject
    return true
  } catch (error) {
    // Jemand anderes hat das Projekt inzwischen geändert.
    if (error instanceof ApiError && error.status === 412) await loadProjects()
    return false
  }
}
