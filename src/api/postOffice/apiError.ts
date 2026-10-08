// Der einheitliche Fehler der Poststelle: Das Backend hat mit einem Fehler
// geantwortet oder war gar nicht erreichbar.
export class ApiError extends Error {
  /** HTTP-Status; 0, wenn gar keine Antwort kam. */
  readonly status: number
  /** Erklärung des Backends (Feld „detail“ seines ProblemDetail), falls vorhanden. */
  readonly detail: string | null
  readonly method: string
  readonly path: string
  /** Kennung des Aufrufs, für Nutzer als „Fehler-ID“. */
  readonly requestId: string

  constructor(properties: Pick<ApiError, 'status' | 'detail' | 'method' | 'path' | 'requestId'>) {
    const { status, detail, method, path, requestId } = properties
    super(`${method} ${path} → ${status}${detail ? ` – ${detail}` : ''} (Request-ID ${requestId})`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.method = method
    this.path = path
    this.requestId = requestId
  }

  /** Keine Antwort, oder der Zwischenserver (Vite-Proxy, später nginx)
   *  erreicht das Backend nicht. */
  get isUnreachable() {
    return [0, 502, 503, 504].includes(this.status)
  }
}
