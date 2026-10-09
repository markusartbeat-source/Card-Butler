// Alles, was das Backend über Projekte weiß und mit ihnen macht.
import { postOffice } from '../postOffice/transport'

// Ein Projekt, wie das Backend es liefert.
export type Project = {
  id: string
  name: string
  /** Änderungszähler des ganzen Projekts, für den späteren Änderungsabgleich. */
  revision: number
  /** Stand des Projekts selbst, wird beim Ändern als If-Match mitgeschickt. */
  version: number
  createdAt: string
  modifiedAt: string
  createdBy: string
  modifiedBy: string
}

/** Lädt alle Projekte, auf die die angemeldete Person Zugriff hat. */
function loadProjects() {
  return postOffice.request<Project[]>('/api/projects')
}

/** Lädt ein Projekt. 404, wenn es das Projekt nicht gibt oder der Zugriff fehlt. */
function loadProject(projectId: string) {
  return postOffice.request<Project>(`/api/projects/${encodeURIComponent(projectId)}`)
}

/** Legt ein Projekt an; es gehört dann der angemeldeten Person. */
function createProject(name: string) {
  return postOffice.request<Project>('/api/projects', { method: 'POST', body: { name } })
}

/** Fach `projects` der Poststelle, Aufruf als `postOffice.projects.…()`. */
export const projectsApi = { loadProjects, loadProject, createProject }
