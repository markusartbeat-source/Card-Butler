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
