// Die Hülle, in der das Backend Kartensets, Karten, Elemente usw. liefert. Was
// in `data` steht, hängt von der Art der Ressource ab.
export type Resource<Data> = {
  id: string
  projectId: string
  /** Art der Ressource, z.B. `SET` oder `CARD`. */
  kind: string
  /** Übergeordnete Ressource, z.B. das Kartenset einer Karte. */
  parentId: string | null
  data: Data
  /** Stand der Ressource, wird beim Ändern als If-Match mitgeschickt. */
  version: number
  createdAt: string
  modifiedAt: string
  createdBy: string
  modifiedBy: string
}

/** Zum Sortieren: die ältere Ressource zuerst. Das Backend liefert Listen in
 *  keiner festen Reihenfolge. */
export function olderFirst(first: Resource<unknown>, second: Resource<unknown>) {
  return Date.parse(first.createdAt) - Date.parse(second.createdAt)
}

/** Zum Sortieren: die neuere Ressource zuerst. */
export function newerFirst(first: Resource<unknown>, second: Resource<unknown>) {
  return olderFirst(second, first)
}
