// Der Versand der Poststelle: Cookie, CSRF, Request-ID, JSON. Nur Transport –
// Fachliches gehört in die Themen-Ordner unter src/api/. Nur diese nutzen die
// Datei direkt, der Rest der App geht über postOffice.ts.
import { requestLog } from '../../requestLog/requestLog'
import { ApiError } from './apiError'
import { showErrorToast } from './errorToast'

export type PostOfficeRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Wird als JSON gesendet. */
  body?: unknown
  /** Status, mit denen der Aufrufer rechnet: Geworfen wird trotzdem, aber
   *  ohne Toast und Konsole (z.B. 401 bei /api/me = niemand angemeldet). */
  expectedStatuses?: number[]
}

type CsrfToken = { headerName: string; token: string }

// Schutz gegen gefälschte Aufrufe fremder Seiten. Wird beim ersten
// schreibenden Aufruf geholt und im Speicher gehalten.
let csrfToken: CsrfToken | null = null

/** Schickt einen Aufruf ans Backend (relativer Pfad, Sitzungs-Cookie dabei)
 *  und liefert die Antwort als JSON. Wirft bei Fehlern nur `ApiError`. */
async function request<ResponseBody>(
  path: string,
  { method = 'GET', body, expectedStatuses = [] }: PostOfficeRequestOptions = {},
): Promise<ResponseBody> {
  // Kennzeichnet den Aufruf, damit er sich in Protokollen wiederfinden lässt.
  const requestId = crypto.randomUUID()
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Request-Id': requestId }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET') {
    csrfToken ??= await request<CsrfToken>('/api/csrf')
    headers[csrfToken.headerName] = csrfToken.token
  }

  const startTime = performance.now()
  let status = 0
  let unreachable = false // TEMPORÄR (Poststellen-Protokoll)

  // Baut den Fehler und meldet ihn in Konsole und Toast – die einzige Stelle
  // dafür. Erwartete Status bleiben still.
  function fail(detail: string | null = null) {
    const error = new ApiError({ status, detail, method, path, requestId })
    if (!expectedStatuses.includes(status)) {
      console.error(error)
      showErrorToast(error)
    }
    return error
  }

  try {
    // Keine Antwort (offline, Server aus) wirft hier – das wird Status 0.
    const response = await fetch(path, {
      method,
      credentials: 'include',
      redirect: 'manual',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    }).catch(() => null)
    if (!response) throw fail()

    // Weiterleitungen des Backends (z.B. nach dem Abmelden) gelten der
    // Adresszeile, nicht diesem Aufruf: Ihnen wird nicht gefolgt, sie zählen
    // als Erfolg ohne Inhalt. Den Status verbirgt der Browser dabei; Spring
    // schickt 302.
    if (response.type === 'opaqueredirect') {
      status = 302
      return undefined as ResponseBody
    }

    status = response.status
    if (!response.ok) {
      // Nicht jede Fehlerantwort hat einen JSON-Inhalt (z.B. 502 vom Proxy).
      const problem = await response.json().catch(() => null)
      throw fail(problem?.detail ?? null)
    }

    // Manche Antworten (z.B. 204) haben keinen Inhalt.
    const responseText = await response.text()
    return responseText ? JSON.parse(responseText) : undefined
  } catch (error) {
    // TEMPORÄR (Poststellen-Protokoll): wird im Aufräumschritt entfernt.
    unreachable = error instanceof ApiError && error.isUnreachable
    throw error
  } finally {
    // TEMPORÄR (Poststellen-Protokoll): wird im Aufräumschritt entfernt.
    requestLog.unshift({
      method,
      path,
      status,
      durationInMilliseconds: Math.round(performance.now() - startTime),
      requestId,
      unreachable,
    })
  }
}

/** Nach dem Abmelden aufrufen: Das Backend macht den Token dann ungültig. */
function forgetCsrfToken() {
  csrfToken = null
}

/** In den Themen-Ordnern als `postOffice.request(...)` aufrufen. */
export const postOffice = { request, forgetCsrfToken }
