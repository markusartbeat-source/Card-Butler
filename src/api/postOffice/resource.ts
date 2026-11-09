// Gemeinsame Metadaten der flachen Fachobjekte der API.
export type Resource<Data> = Data & {
  id: string
  projectId: string
  /** Stand der Ressource, wird beim Ändern als If-Match mitgeschickt. */
  version: number
  audit: {
    createdAt: string
    modifiedAt: string
    createdBy: string
    modifiedBy: string
  }
}

/** Zum Sortieren: die ältere Ressource zuerst. Das Backend liefert Listen in
 *  keiner festen Reihenfolge. */
export function olderFirst(first: Resource<unknown>, second: Resource<unknown>) {
  return Date.parse(first.audit.createdAt) - Date.parse(second.audit.createdAt)
}

/** Zum Sortieren: die neuere Ressource zuerst. */
export function newerFirst(first: Resource<unknown>, second: Resource<unknown>) {
  return olderFirst(second, first)
}
